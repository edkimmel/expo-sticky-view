package expo.modules.stickyview

import android.content.Context
import android.view.View
import android.view.ViewGroup
import android.view.ViewParent
import android.widget.ScrollView
import expo.modules.kotlin.AppContext
import expo.modules.kotlin.views.ExpoView
import com.facebook.react.views.scroll.ReactScrollView
import com.facebook.react.views.scroll.ReactScrollViewHelper
import com.facebook.react.views.scroll.ScrollEventType
import expo.modules.kotlin.viewevent.EventDispatcher
import kotlin.math.abs
import kotlin.math.round

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

fun Context.pxToDp(px: Double): Double {
  return (px / this.resources.displayMetrics.density)
}

sealed class StickyMode {
  data class Top(val offset: Double) : StickyMode()
  data class Bottom(val offset: Double) : StickyMode()
}

class ExpoStickyView(context: Context, appContext: AppContext) : ExpoView(context, appContext) {
  val onStickyChange by EventDispatcher()
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
    val maxTranslation = parentView.height - this.height - this.top
    val shouldStick = relativeY < offset
    if (shouldStick) {
      val pendingTranslation = offset - relativeY
      this.translationY = pendingTranslation.toFloat().coerceAtMost(maxTranslation.toFloat())
    } else {
      this.translationY = 0.0f
    }
    onStickyChange(mapOf(
        "isStuck" to shouldStick,
        "currentFloatDistance" to round(context.pxToDp(abs(this.translationY.toDouble()))),
        "maxFloatDistance" to round(context.pxToDp(abs(maxTranslation.toDouble())))
    ))
  }

  private fun applyStickyBottom(scrollableAncestor: ScrollView, parentView: View, offset: Double) {
    val relativePosition = getLocationRelativeToViewWithoutTranslation(scrollableAncestor)
    val relativeY = relativePosition[1]
    val scrollableAncestorHeight = scrollableAncestor.height

    val relativeBottom = relativeY + this.height
    // The max offset we can have is this.top to float to the top of the parent
    val minTranslation = -this.top.toDouble()

    val shouldStick = relativeBottom > scrollableAncestorHeight - offset
    if (shouldStick) {
      val delta = scrollableAncestorHeight - offset - relativeBottom
      this.translationY = delta.coerceAtLeast(minTranslation).toFloat()
    } else {
      this.translationY = 0.0f
    }
    onStickyChange(mapOf(
      "isStuck" to shouldStick,
      "currentFloatDistance" to round(context.pxToDp(abs(this.translationY.toDouble()))),
      "maxFloatDistance" to round(context.pxToDp(abs(minTranslation))),
    ))
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
