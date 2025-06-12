import ExpoModulesCore

public class ExpoStickyViewModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoStickyView")

    View(ExpoStickyView.self) {
      Events("onStickyChange")

      Prop("topOffset") { (view: ExpoStickyView, top: Double?) in
        if let top = top {
          view.setStickyTop(top)
        }
      }

      Prop("bottomOffset") { (view: ExpoStickyView, bottom: Double?) in
        if let bottom = bottom {
          view.setStickyBottom(bottom)
        }
      }
    }
  }
}