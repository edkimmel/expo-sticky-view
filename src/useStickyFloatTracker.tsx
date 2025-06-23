/* eslint-disable no-restricted-globals */
import React from 'react'
import { StickyChangeEventCallback } from './ExpoStickyView.types'
import { View } from 'react-native'

const calculateTopValues = (
  sticky: HTMLElement,
  sentinel: HTMLElement,
  container: HTMLElement
) => {
  const marginTop = sticky.style.marginTop ? parseInt(sticky.style.marginTop, 10) : 0

  const originalTop = sentinel.offsetTop + marginTop
  const isStuck = originalTop !== sticky.offsetTop
  const currentFloatDistance = Math.max(0, sticky.offsetTop - originalTop)
  const maxFloatDistance = container.offsetHeight - sticky.offsetHeight - originalTop
  return { currentFloatDistance, isStuck, maxFloatDistance }
}

const calculateBottomValues = (
  sticky: HTMLElement,
  sentinel: HTMLElement,
) => {
  const stickyOffset = sticky.style.bottom ? parseInt(sticky.style.bottom, 10) : 0
  const marginTop = sticky.style.marginTop ? parseInt(sticky.style.marginTop, 10) : 0

  const originalTop = sentinel.offsetTop + marginTop
  const isStuck = originalTop !== sticky.offsetTop
  const currentFloatDistance = Math.max(0, originalTop - sticky.offsetTop)
  const maxFloatDistance = originalTop - stickyOffset
  return { currentFloatDistance, isStuck, maxFloatDistance }
}

function getScrollingAncestor(element: HTMLElement) {
  let parent = element.parentElement
  while (parent) {
    const style = getComputedStyle(parent)
    const overflowY = style.overflowY
    const overflowX = style.overflowX
    const isScrollableY = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay'
    const isScrollableX = overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay'
    if (
      (isScrollableY && parent.scrollHeight > parent.clientHeight) ||
      (isScrollableX && parent.scrollWidth > parent.clientWidth)
    ) {
      return parent
    }
    parent = parent.parentElement
  }
  return document.scrollingElement || document.documentElement
}

const useStickyFloatTracker = (
  stickyRef: React.RefObject<View | null>,
  sentinelRef: React.RefObject<Text | null>,
  onFloatChange?: StickyChangeEventCallback | null,
) => {
  React.useEffect(() => {
    const sticky = stickyRef.current as HTMLElement | null
    const sentinel = sentinelRef.current as HTMLElement | null
    const container = sticky?.parentElement
    const scrollElement = sticky && getScrollingAncestor(sticky)
    if (!sticky || !sentinel || !container || !scrollElement) return
    const handleScroll = () => {
      if (sticky.style.top !== '') {
        const { isStuck, currentFloatDistance, maxFloatDistance } = calculateTopValues(sticky, sentinel, container)
        onFloatChange?.({ isStuck, currentFloatDistance: currentFloatDistance, maxFloatDistance })
      } else if (sticky.style.bottom !== '') {
        const { isStuck, currentFloatDistance, maxFloatDistance } = calculateBottomValues(sticky, sentinel)
        onFloatChange?.({ isStuck, currentFloatDistance: currentFloatDistance, maxFloatDistance })
      }
    }

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    handleScroll()

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [stickyRef, sentinelRef, onFloatChange])
}

export default useStickyFloatTracker
