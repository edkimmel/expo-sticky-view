/* eslint-disable no-restricted-globals */
import React from 'react'
import { StickyChangeEventCallback } from './ExpoStickyView.types'
import { View } from 'react-native'

const calculateTopValues = (container: HTMLElement, sticky: HTMLElement, scrollable: Element) => {
  const containerRect = container.getBoundingClientRect()
  const stickyRect = sticky.getBoundingClientRect()
  const stickyOffset = parseInt(sticky.style.top ?? 0, 10)
  const originalTop = containerRect.top + sticky.offsetTop
  const currentFloatDistance = Math.max(
    0,
    Math.min(scrollable.scrollTop + stickyOffset - originalTop, containerRect.height - stickyRect.height),
  )
  const isStuck = currentFloatDistance > 0
  const maxFloatDistance = containerRect.height - stickyRect.height
  return { currentFloatDistance, isStuck, maxFloatDistance }
}

const calculateBottomValues = (sticky: HTMLElement, container: HTMLElement, scrollable: Element) => {
  const containerRect = container.getBoundingClientRect()
  const stickyRect = sticky.getBoundingClientRect()
  const maxFloatDistance = containerRect.height - stickyRect.height
  const currentFloatDistance = maxFloatDistance - Math.max(
    0,
    Math.min(stickyRect.top - containerRect.top, containerRect.height - stickyRect.height),
  )
  const isStuck = currentFloatDistance > 0
  console.debug('calculateBottomValues', {
    currentFloatDistance,
    isStuck,
    maxFloatDistance,
  })
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
  onFloatChange?: StickyChangeEventCallback | null,
) => {
  React.useEffect(() => {
    const sticky = stickyRef.current as HTMLElement | null
    const container = sticky?.parentElement
    const scrollElement = sticky && getScrollingAncestor(sticky)
    if (!sticky || !container || !scrollElement) return
    const handleScroll = () => {
      if (sticky.style.top !== '') {
        const { isStuck, currentFloatDistance, maxFloatDistance } = calculateTopValues(sticky, container, scrollElement)
        onFloatChange?.({ isStuck, currentFloatDistance: currentFloatDistance, maxFloatDistance })
      } else if (sticky.style.bottom !== '') {
        const { isStuck, currentFloatDistance, maxFloatDistance } = calculateBottomValues(sticky, container, scrollElement)
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
  }, [stickyRef, onFloatChange])
}

export default useStickyFloatTracker
