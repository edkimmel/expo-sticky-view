import type { ViewProps } from 'react-native';
import { StickyChangeEvent } from './NativeExpoStickyView.types';

export type { StickyChangeEvent } from './NativeExpoStickyView.types';

export type StickyChangeEventCallback = (
  event: StickyChangeEvent,
) => void;

export type ExpoStickyViewProps = ViewProps &
  React.PropsWithChildren<{
    topOffset?: number;
    bottomOffset?: number;
    onStickyChange?: StickyChangeEventCallback | undefined | null;
  }>;
