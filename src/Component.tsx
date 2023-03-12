import React from "react";
import { Text, View } from "react-native";
import { areObjectShallowEqual } from "./datadog/ShallowObjectEqualityChecker";
import { useAsyncState } from "./useAsyncState";

const originalMemo = React.memo;

/**
 * This pulls from packages/core/src/rum/instrumentation/interactionTracking/DdRumUserInteractionTracking.tsx
 *
 * It's tedioust to fully set up the Datadog SDK and mock it in the Jest environment.
 * Instead, we can just override React.memo here, in the same way `DdRumUserInteractionTracking.startTracking()` does.
 * That is sufficient to trigger the same behavior the SDK does and thus the error in question.
 */
React.memo = (
  component: any,
  propsAreEqual?: (prevProps: any, newProps: any) => boolean
) => {
  return originalMemo(component, (prev, next) => {
    if (!next.onPress || !prev.onPress) {
      return propsAreEqual
        ? propsAreEqual(prev, next)
        : areObjectShallowEqual(prev, next);
    }
    // we replace "our" onPress from the props by the original for comparison
    const { onPress: _prevOnPress, ...partialPrevProps } = prev;
    const prevProps = {
      ...partialPrevProps,
      onPress: prev.__DATADOG_INTERNAL_ORIGINAL_ON_PRESS__,
    };

    const { onPress: _nextOnPress, ...partialNextProps } = next;
    const nextProps = {
      ...partialNextProps,
      onPress: next.__DATADOG_INTERNAL_ORIGINAL_ON_PRESS__,
    };

    // if no comparison function is provided we do shallow comparison
    return propsAreEqual
      ? propsAreEqual(prevProps, nextProps)
      : areObjectShallowEqual(nextProps, prevProps);
  });
};

interface ComponentProps {
  testProp?: boolean;
}

export const Component = React.memo(function Component({
  testProp = false,
}: ComponentProps) {
  const asyncState = useAsyncState(false);

  return (
    <View>
      {asyncState ? (
        <Text>asyncState is true</Text>
      ) : (
        <Text>asyncState is false</Text>
      )}
      {testProp ? (
        <Text>testProp is true</Text>
      ) : (
        <Text>testProp is false</Text>
      )}
    </View>
  );
});
