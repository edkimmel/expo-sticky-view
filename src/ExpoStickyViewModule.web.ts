import { NativeModule, registerWebModule } from 'expo';

class ExpoStickyViewModule extends NativeModule {}

export default registerWebModule(ExpoStickyViewModule, 'ExpoStickyViewModule');
