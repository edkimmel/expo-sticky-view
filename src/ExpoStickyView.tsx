import { requireNativeView } from 'expo';
import * as React from 'react';

import type { ExpoStickyViewProps } from './ExpoStickyView.types';
import { NativeSyntheticEvent } from 'react-native';
import { NativeExpoStickyViewProps, StickyChangeEvent } from './NativeExpoStickyView.types';

const NativeView: React.ComponentType<NativeExpoStickyViewProps> =
  requireNativeView('ExpoStickyView');

export default function ExpoStickyView(props: ExpoStickyViewProps) {
  const unWrappedCallback = React.useMemo(() => {
    if (!props.onStickyChange) {
      return undefined
    }
    return (event: NativeSyntheticEvent<StickyChangeEvent>) => {
      props.onStickyChange?.(event.nativeEvent);
    };
  }, [props.onStickyChange])
  return <NativeView {...props} onStickyChange={unWrappedCallback} />;
}
