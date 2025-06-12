import { NativeModule, requireNativeModule } from 'expo';

declare class ExpoStickyViewModule extends NativeModule {}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoStickyViewModule>('ExpoStickyView');
