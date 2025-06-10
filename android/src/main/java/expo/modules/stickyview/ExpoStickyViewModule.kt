package expo.modules.stickyview

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.net.URL

class ExpoStickyViewModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoStickyView")

    View(ExpoStickyView::class) {
      Prop("topOffset") { view: ExpoStickyView, top: Double? ->
        if (top != null) {
          view.setStickyTop(top)
        }
      }
      Prop("bottomOffset") { view: ExpoStickyView, bottom: Double? ->
        if (bottom != null) {
          view.setStickyBottom(bottom)
        }
      }
    }
  }
}
