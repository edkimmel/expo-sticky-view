import { requireNativeView } from 'expo';
import * as React from 'react';

import { ExpoStickyViewProps } from './ExpoStickyView.types';

const NativeView: React.ComponentType<ExpoStickyViewProps> =
  requireNativeView('ExpoStickyView');

export default function ExpoStickyView(props: ExpoStickyViewProps) {
  return <NativeView {...props} />;
}
