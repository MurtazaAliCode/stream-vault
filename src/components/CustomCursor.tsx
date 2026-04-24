'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let raf: number

    const moveCursor = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      }
    }

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`
      }
      raf = requestAnimationFrame(animateRing)
    }

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, input, [role="button"]')
      
      if (isInteractive) {
        if (dotRef.current) {
          dotRef.current.style.width = '12px'
          dotRef.current.style.height = '12px'
          dotRef.current.style.background = '#ff6b35'
        }
        if (ringRef.current) {
          ringRef.current.style.width = '48px'
          ringRef.current.style.height = '48px'
          ringRef.current.style.borderColor = 'rgba(255,107,53,0.4)'
        }
      } else {
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
    }

    window.addEventListener('mousemove', moveCursor)
    window.addEventListener('mouseover', onMouseOver)
    raf = requestAnimationFrame(animateRing)

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      window.removeEventListener('mouseover', onMouseOver)
      cancelAnimationFrame(raf)
    }
  }, [pathname])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
