package expo.modules.stickyview

import android.content.Context
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import android.view.ViewTreeObserver
import android.widget.ScrollView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import com.facebook.react.views.scroll.ReactScrollView
import com.facebook.react.views.scroll.ReactScrollViewHelper
import com.facebook.react.views.scroll.ReactScrollViewManager
import com.facebook.react.views.scroll.ScrollEventType

fun View.getParentView(): View? {
  val parent = this.parent
  return if (parent is View) parent else null
}

fun View.findClosestScrollableAncestor(): ReactScrollView? {
  var ancestor: ViewParent? = this.parent
  while (ancestor is ViewGroup) {
    if (ancestor is ReactScrollView) {
      return ancestor
    }
    ancestor = ancestor.parent
  }
  return null
}

fun View.getLocationInWindow(): IntArray {
  val location = IntArray(2)
  this.getLocationInWindow(location)
  return location
}

fun View.getLocationRelativeToViewWithoutTranslation(view: View): IntArray {
  val location = IntArray(2)
  this.getLocationInWindow(location)
  location[0] -= translationX.toInt()
  location[1] -= translationY.toInt()
  val viewLocation = view.getLocationInWindow()
  location[0] -= viewLocation[0]
  location[1] -= viewLocation[1]
  return location
}

fun Context.dpToPx(dp: Double): Double {
  return (dp * this.resources.displayMetrics.density)
}

sealed class StickyMode {
  data class Top(val offset: Double) : StickyMode()
  data class Bottom(val offset: Double) : StickyMode()
}

class ExpoStickyView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  private var scrollableAncestor: ReactScrollView? = null
  private var stickyMode: StickyMode = StickyMode.Top(0.0)
  private val scrollListener: ReactScrollViewHelper.ScrollListener = object : ReactScrollViewHelper.ScrollListener {
    override fun onScroll(
      scrollView: ViewGroup?,
      scrollEventType: ScrollEventType?,
      xVelocity: Float,
      yVelocity: Float
    ) {
      if (scrollView === scrollableAncestor) {
        applySticky()
      }
    }
    override fun onLayout(scrollView: ViewGroup?) {
      applySticky()
    }

  }

  override fun onAttachedToWindow() {
    super.onAttachedToWindow()
    this.scrollableAncestor = findClosestScrollableAncestor()
    ReactScrollViewHelper.addScrollListener(this.scrollListener)
  }

  override fun onDetachedFromWindow() {
    super.onDetachedFromWindow()
    ReactScrollViewHelper.removeScrollListener(this.scrollListener)
    this.scrollableAncestor = null
  }

  private fun applySticky() {
    // Calculate the position of this view relative to the scrollable ancestor
    val parentView = getParentView()
    val scrollableAncestor = this.scrollableAncestor
    if (parentView == null || scrollableAncestor == null) {
      return
    }
    when(val stickyMode = this.stickyMode) {
      is StickyMode.Top -> applyStickyTop(scrollableAncestor, parentView, stickyMode.offset)
      is StickyMode.Bottom -> applyStickyBottom(scrollableAncestor, parentView, stickyMode.offset)
    }
  }
  private fun applyStickyTop(scrollableAncestor: ScrollView, parentView: View, offset: Double) {
    val relativePosition = getLocationRelativeToViewWithoutTranslation(scrollableAncestor)
    val relativeY = relativePosition[1]
    val maxTranslate = parentView.height - this.height - this.top
    if (relativeY < offset) {
      this.translationY = maxTranslate.toFloat().coerceAtMost((offset - relativeY).toFloat())
    } else {
      this.translationY = 0.0f
    }
  }
  private fun applyStickyBottom(scrollableAncestor: ScrollView, parentView: View, offset: Double) {
    val relativePosition = getLocationRelativeToViewWithoutTranslation(scrollableAncestor)
    val relativeY = relativePosition[1]
    val scrollableAncestorHeight = scrollableAncestor.height

    val relativeBottom = relativeY + this.height
    // The max offset we can have is this.top to float to the top of the parent
    val minTranslation = -this.top.toDouble()

    if (relativeBottom > scrollableAncestorHeight - offset) {
      val delta = scrollableAncestorHeight - offset - relativeBottom
      this.translationY = delta.coerceAtLeast(minTranslation).toFloat()
    } else {
      this.translationY = 0.0f
    }
  }

  fun setStickyTop(offset: Double) {
    this.stickyMode = StickyMode.Top(context.dpToPx(offset))
    applySticky()
  }
  fun setStickyBottom(offset: Double) {
    this.stickyMode = StickyMode.Bottom(context.dpToPx(offset))
    applySticky()
  }
}
