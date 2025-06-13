import * as React from 'react';

import type { ExpoStickyViewProps } from './ExpoStickyView.types';
import useStickyFloatTracker from './useStickyFloatTracker';
import { View, ViewStyle } from 'react-native';


export default function ExpoStickyView(props: ExpoStickyViewProps) {
  const ref = React.useRef<View | null>(null);
  useStickyFloatTracker(ref, props.onStickyChange)
  return (
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
  );
}
