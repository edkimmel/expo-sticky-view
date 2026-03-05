package expo.modules.stickyview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoStickyViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoStickyView")

    View(ExpoStickyView::class) {
      Events("onStickyChange")
      Prop("topOffset") { view: ExpoStickyView, top: Double? ->
        if (top != null) {
          view.setStickyTop(top)
        } else {
          view.clearSticky()
        }
      }
      Prop("bottomOffset") { view: ExpoStickyView, bottom: Double? ->
        if (bottom != null) {
          view.setStickyBottom(bottom)
        } else {
          view.clearSticky()
        }
      }
    }
  }
}
