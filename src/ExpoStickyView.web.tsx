import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import type { ExpoStickyViewProps } from './ExpoStickyView.types';
import useStickyFloatTracker from './useStickyFloatTracker';
import { View, ViewStyle } from 'react-native';


const styles = StyleSheet.create({
  sentinel: {
    // block is a valid value for display in React Native web
    display: 'block' as ViewStyle['display'],
    height: 0,
    width: 0,
    padding: 0,
    margin: 0
  }
})

export default function ExpoStickyView(props: ExpoStickyViewProps) {
  const ref = React.useRef<View | null>(null);

  // We use a sentinel to read the original position of the sticky view in the parent
  // This is necessary because the sticky view may be moved by the browser on first render, if we start with a pre-existing scroll position.
  const sentinelRef = React.useRef<Text | null>(null);
  useStickyFloatTracker(ref, sentinelRef, props.onStickyChange)
  return (
    <>
      <Text ref={sentinelRef} style={styles.sentinel} />
      <View
        ref={ref}
        style={[props.style, {
          position: 'sticky' as ViewStyle['position'],
          top: props.topOffset,
          bottom: props.bottomOffset,
        }]}
      >
      {props.children}
    </View>
    </>
  );
}
