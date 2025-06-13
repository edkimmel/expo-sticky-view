import type { NativeSyntheticEvent, ViewProps } from 'react-native';

export type StickyChangeEvent = {
  isStuck: boolean;
  currentFloatDistance: number;
  maxFloatDistance: number;
};

export type StickyChangeEventCallback = (
  event: NativeSyntheticEvent<StickyChangeEvent>,
) => void;

export type NativeExpoStickyViewProps = ViewProps &
  React.PropsWithChildren<{
    topOffset?: number;
    bottomOffset?: number;
    onStickyChange?: StickyChangeEventCallback | undefined | null;
  }>;
