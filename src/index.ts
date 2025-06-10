// Reexport the native module. On web, it will be resolved to ExpoStickyViewModule.web.ts
// and on native platforms to ExpoStickyViewModule.ts
export { default } from './ExpoStickyViewModule';
export { default as ExpoStickyView } from './ExpoStickyView';
export * from  './ExpoStickyView.types';
