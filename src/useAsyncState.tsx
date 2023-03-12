import { useEffect } from "react";
import { atom, DefaultValue, useRecoilState } from "recoil";

const syncAtom = atom({
  key: "sync-atom",
  default: true,
});

const asyncAtom = atom<undefined | boolean>({
  key: "async-atom",
  // This is to allow for the scenario where the default could be set to anything, including undefined - no default value is a valid outcome
  default: undefined,
  effects: [
    ({ onSet, setSelf, getPromise }) => {
      // Asynchronously fetching state can trigger Suspense
      const fetcher = async () => {
        // This allows us to asynchronously get internal state, purely for purpose of causing Recoil to suspend the components relying on this state
        const syncState = await getPromise(syncAtom);

        // An extra promise for added measure
        const data = await Promise.resolve(syncState);
        if (data) {
          return data;
        }

        // The default is undefined, so adds some additional funkiness into the mix
        return new DefaultValue();
      };

      // This allows us to asynchronously set Recoil's internal state
      const setAsync = () => {
        Promise.resolve(fetcher()).then(setSelf);
      };

      setSelf(fetcher());

      onSet((newValue, oldValue, isReset) => {
        if (isReset) {
          setAsync();
        }
      });
    },
  ],
});

// For purpose of the bug, we need a way to cause a component to suspend. Invoking an effect which causes an async state update in Recoil will trigger Suspense
export function useAsyncState(defaultAsyncState: boolean): boolean | undefined {
  const [asyncState, setAsyncState] = useRecoilState(asyncAtom);

  useEffect(() => {
    // This allows us to trigger an async state update and suspend the invoking component
    const updateAsyncState = async () => {
      // This asynchronously resolves to a valid value, or the default if provided
      const newAsyncState = await Promise.resolve(!defaultAsyncState);
      // This is where things get weird; behind the scenes, Recoil might backfill the default: () => undefined as the state while consumers get set to newValue, breaking Datadog's React.memo override
      setAsyncState(newAsyncState);
    };
    void updateAsyncState();
  }, [defaultAsyncState, setAsyncState]);

  return asyncState;
}
