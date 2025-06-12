import { requireNativeView } from 'expo';
import type * as React from 'react';

import type { ExpoStickyViewProps } from './ExpoStickyView.types';

const NativeView: React.ComponentType<ExpoStickyViewProps> =
  requireNativeView('ExpoStickyView');

export default function ExpoStickyView(props: ExpoStickyViewProps) {
  return <NativeView {...props} />;
}
