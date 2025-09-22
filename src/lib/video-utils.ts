export function generateVideoPoster(videoSrc: string): string {
  if (typeof window === 'undefined') return '/Images/video-poster.jpg'
  
  const canvas = document.createElement('canvas')
  const video = document.createElement('video')
  
  return new Promise((resolve) => {
    video.addEventListener('loadeddata', () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        const posterUrl = canvas.toDataURL('image/jpeg', 0.8)
        resolve(posterUrl)
      } else {
        resolve('/Images/video-poster.jpg')
      }
    })
    
    video.addEventListener('error', () => {
      resolve('/Images/video-poster.jpg')
    })
    
    video.src = videoSrc
    video.currentTime = 1
  })
}

export function optimizeVideoForConnection(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  
  const connection = (navigator as any).connection
  
  if (connection) {
    const { effectiveType, downlink, saveData } = connection
    
    if (saveData || effectiveType === 'slow-2g' || effectiveType === '2g') {
      return 'mobile'
    }
    
    if (effectiveType === '3g' || downlink < 2) {
      return 'tablet'  
    }
  }
  
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  
  return 'desktop'
}

export function preloadVideo(src: string, priority: boolean = false): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    
    video.addEventListener('canplaythrough', () => {
      resolve(video)
    })
    
    video.addEventListener('error', (e) => {
      reject(e)
    })
    
    video.preload = priority ? 'auto' : 'metadata'
    video.src = src
  })
}

export function calculateVideoLoadTime(videoElement: HTMLVideoElement): number {
  const startTime = performance.now()
  
  return new Promise((resolve) => {
    const handleCanPlay = () => {
      const loadTime = performance.now() - startTime
      resolve(loadTime)
      videoElement.removeEventListener('canplay', handleCanPlay)
    }
    
    videoElement.addEventListener('canplay', handleCanPlay)
  })
}

export function getOptimalVideoQuality(
  availableQualities: Record<string, string>,
  deviceType?: 'mobile' | 'tablet' | 'desktop'
): string {
  const device = deviceType || optimizeVideoForConnection()
  
  return availableQualities[device] || availableQualities.desktop
}

export function setupVideoPerformanceMonitoring(video: HTMLVideoElement) {
  const metrics = {
    loadStart: 0,
    canPlay: 0,
    playing: 0,
    errors: 0
  }
  
  video.addEventListener('loadstart', () => {
    metrics.loadStart = performance.now()
  })
  
  video.addEventListener('canplay', () => {
    metrics.canPlay = performance.now()
  })
  
  video.addEventListener('playing', () => {
    metrics.playing = performance.now()
  })
  
  video.addEventListener('error', () => {
    metrics.errors++
  })
  
  return metrics
}