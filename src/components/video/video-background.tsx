'use client'

import { useEffect, useRef, useState } from 'react'
import { VideoBackgroundProps } from '@/types/landing-page'
import { createIntersectionObserver, shouldLoadVideo } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function VideoBackground({
  configuration,
  onStateChange,
  className,
  overlay,
  priority = false
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldLoad, setShouldLoad] = useState(priority || !configuration.loadingStrategy.lazy)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (priority || !configuration.loadingStrategy.lazy) {
      setShouldLoad(true)
      return
    }

    if (!shouldLoadVideo()) {
      onStateChange('error')
      setHasError(true)
      return
    }

    const observer = createIntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true)
          observer?.disconnect()
        }
      },
      configuration.loadingStrategy.intersectionThreshold
    )

    if (observer && containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer?.disconnect()
  }, [configuration, onStateChange, priority])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoad) return

    const handleLoadStart = () => onStateChange('loading')
    const handleCanPlay = () => onStateChange('playing')
    const handleError = () => {
      onStateChange('error')
      setHasError(true)
    }
    const handleLoadedData = () => onStateChange('playing')

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('error', handleError)
    video.addEventListener('loadeddata', handleLoadedData)

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('error', handleError)
      video.removeEventListener('loadeddata', handleLoadedData)
    }
  }, [shouldLoad, onStateChange])

  if (hasError) {
    return (
      <div
        ref={containerRef}
        className={cn(
          "absolute inset-0 bg-black",
          className
        )}
        style={{
          backgroundImage: `url(${configuration.poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {overlay && (
          <div
            data-testid="video-overlay"
            className="absolute inset-0"
            style={{
              backgroundColor: overlay.color,
              opacity: overlay.opacity
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className={cn("absolute inset-0", className)}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        poster={configuration.poster}
        autoPlay={configuration.playbackSettings.autoplay}
        muted={configuration.playbackSettings.muted}
        loop={configuration.playbackSettings.loop}
        playsInline={configuration.playbackSettings.playsInline}
        preload={configuration.playbackSettings.preload}
        role="img"
        aria-label="Background video"
      >
        {shouldLoad && configuration.sources.map((source, index) => (
          <source
            key={index}
            src={source.src}
            type={source.type}
            media={source.media}
          />
        ))}
      </video>

      {overlay && (
        <div
          data-testid="video-overlay"
          className="absolute inset-0"
          style={{
            backgroundColor: overlay.color,
            opacity: overlay.opacity
          }}
        />
      )}
    </div>
  )
}