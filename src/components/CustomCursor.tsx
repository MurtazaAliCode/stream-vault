'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let raf: number

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.left = mouseX + 'px'
        dotRef.current.style.top = mouseY + 'px'
      }
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = ringX + 'px'
        ringRef.current.style.top = ringY + 'px'
      }
      raf = requestAnimationFrame(animateRing)
    }

    const onEnterLink = () => {
      if (dotRef.current) {
        dotRef.current.style.width = '12px'
        dotRef.current.style.height = '12px'
        dotRef.current.style.background = '#ff6b35'
      }
      if (ringRef.current) {
        ringRef.current.style.width = '44px'
        ringRef.current.style.height = '44px'
        ringRef.current.style.borderColor = 'rgba(255,107,53,0.4)'
      }
    }

    const onLeaveLink = () => {
      if (dotRef.current) {
        dotRef.current.style.width = '8px'
        dotRef.current.style.height = '8px'
        dotRef.current.style.background = '#00f5c4'
      }
      if (ringRef.current) {
        ringRef.current.style.width = '32px'
        ringRef.current.style.height = '32px'
        ringRef.current.style.borderColor = 'rgba(0,245,196,0.4)'
      }
    }

    document.addEventListener('mousemove', moveCursor)
    document.querySelectorAll('a, button, input').forEach(el => {
      el.addEventListener('mouseenter', onEnterLink)
      el.addEventListener('mouseleave', onLeaveLink)
    })
    raf = requestAnimationFrame(animateRing)

    return () => {
      document.removeEventListener('mousemove', moveCursor)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
