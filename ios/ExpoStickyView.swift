import ExpoModulesCore
import UIKit

enum StickyMode {
  case top(offset: CGFloat)
  case bottom(offset: CGFloat)
}

class ExpoStickyView: ExpoView {
  let onStickyChange = EventDispatcher()
  private var stickyMode: StickyMode = .top(offset: 0)
  private weak var scrollableAncestor: UIScrollView?
  private var scrollObserver: NSKeyValueObservation?
  private var layoutObserver: NSKeyValueObservation?
  private var untransformedFrame: CGRect = CGRectZero()
    
  override func didMoveToWindow() {
    super.didMoveToWindow()
    if window != nil {
      attachToScrollableAncestor()
    } else {
      detachFromScrollableAncestor()
    }
  }

  override func layoutSubviews() {
    super.layoutSubviews()
    self.untransformedFrame = CGRectMake(self.frame.origin.x, self.frame.origin.y - self.transform.ty, self.frame.width, self.frame.height)
    self.applySticky()
  }

  private func attachToScrollableAncestor() {
    guard let ancestor = findClosestScrollableAncestor() else { return }
    scrollableAncestor = ancestor

    scrollObserver = ancestor.observe(\.contentOffset, options: [.new]) { [weak self] _, _ in
      self?.applySticky()
    }
    layoutObserver = ancestor.observe(\.frame, options: [.new]) { [weak self] _, _ in
      self?.applySticky()
    }
    applySticky()
  }

  private func detachFromScrollableAncestor() {
    scrollObserver?.invalidate()
    layoutObserver?.invalidate()
    scrollObserver = nil
    layoutObserver = nil
    scrollableAncestor = nil
  }

  private func findClosestScrollableAncestor() -> UIScrollView? {
    var ancestor: UIView? = self.superview
    while let view = ancestor {
      if let scroll = view as? UIScrollView {
        return scroll
      }
      ancestor = view.superview
    }
    return nil
  }

  private func getLocationRelativeToView(_ view: UIView) -> CGPoint {
    let myFrame = self.convert(self.bounds, to: view)
    return CGPoint(x: myFrame.origin.x - self.transform.tx, y: myFrame.origin.y - self.transform.ty)
  }

  private func applySticky() {
    guard let ancestor = scrollableAncestor, let parent = self.superview else { return }
    switch stickyMode {
    case .top(let offset):
      applyStickyTop(scrollableAncestor: ancestor, parentView: parent, offset: offset)
    case .bottom(let offset):
      applyStickyBottom(scrollableAncestor: ancestor, parentView: parent, offset: offset)
    }
  }

  private func applyStickyTop(scrollableAncestor: UIScrollView, parentView: UIView, offset: CGFloat) {
    let relativePosition = getLocationRelativeToView(scrollableAncestor)
    let relativeY = relativePosition.y - scrollableAncestor.contentOffset.y
    let maxTranslation = CGFloat(parentView.bounds.height - self.bounds.height - self.untransformedFrame.origin.y)
    let shouldStick = relativeY < offset
      
//    NSLog("Bounds \(self.bounds.origin.y) RelativeY: \(relativePosition.y), ContentOffset: \(scrollableAncestor.contentOffset.y) OriginalY: \(self.untransformedFrame.origin.y)")
    if shouldStick {
      let pendingTranslation = offset - relativeY
      self.transform = CGAffineTransform(translationX: 0, y: min(pendingTranslation, maxTranslation))
    } else {
      self.transform = .identity
    }
    onStickyChange([
      "isStuck": shouldStick,
      "currentFloatDistance": abs(self.transform.ty),
      "maxFloatDistance": abs(maxTranslation)
    ])
  }

  private func applyStickyBottom(scrollableAncestor: UIScrollView, parentView: UIView, offset: CGFloat) {
    let relativePosition = getLocationRelativeToView(scrollableAncestor)
    let relativeY = relativePosition.y - scrollableAncestor.contentOffset.y
    let scrollableAncestorHeight = scrollableAncestor.bounds.height
    let relativeBottom = relativeY + self.bounds.height
    let minTranslation = -self.untransformedFrame.origin.y
    let shouldStick = relativeBottom > scrollableAncestorHeight - offset
    if shouldStick {
      let delta = scrollableAncestorHeight - offset - relativeBottom
      self.transform = CGAffineTransform(translationX: 0, y: max(delta, minTranslation))
    } else {
      self.transform = .identity
    }
    onStickyChange([
      "isStuck": shouldStick,
      "currentFloatDistance": abs(self.transform.ty),
      "maxFloatDistance": abs(minTranslation)
    ])
  }

  // MARK: - Props
  func setStickyTop(_ offset: Double) {
    stickyMode = .top(offset: CGFloat(offset))
    applySticky()
  }

  func setStickyBottom(_ offset: Double) {
    stickyMode = .bottom(offset: CGFloat(offset))
    applySticky()
  }
}
