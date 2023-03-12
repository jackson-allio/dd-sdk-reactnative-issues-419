import React, { Suspense, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { RecoilRoot } from "recoil";
import { Component } from "./Component";

export function App() {
  const [testProp, setTestProp] = useState(true);

  // This causes a prop change in Component, forcing React.memo to evaluate
  useEffect(() => {
    setTestProp(false);
  }, []);

  return (
    <RecoilRoot>
      <Suspense fallback={<ActivityIndicator />}>
        {/* Component is memoized, and the parent App is trying to change its props while the Component is Suspended */}
        <Component testProp={testProp} />
      </Suspense>
    </RecoilRoot>
  );
}
