'use client'

import { useState, useEffect, useRef } from 'react'

interface Particle {
  id: number
  size: number
  left: number
  top: number
  duration: number
  delay: number
  opacity: number
  color: string
}

interface Star {
  id: number
  left: number
  top: number
  size: number
  duration: number
  delay: number
}

interface VideoSlideshowProps {
  introPhase: number
}



const VideoSlideshow: React.FC<VideoSlideshowProps> = ({ introPhase }) => {
  const [currentVideo, setCurrentVideo] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  
  // Fitness-related video sources
  const videos = [
    '/videos/run.mp4',
    '/videos/swim.mp4',
    '/videos/backpack.mp4',
    '/videos/bike.mp4'
  ]

  // Gradient backgrounds as fallback
  const gradients = [
    'linear-gradient(45deg, #667eea, #764ba2)',
    'linear-gradient(45deg, #764ba2, #f093fb)', 
    'linear-gradient(45deg, #f093fb, #667eea)',
    'linear-gradient(45deg, #667eea, #f093fb)'
  ]

  useEffect(() => {
    if (introPhase === 3) {
      const interval = setInterval(() => {
        setCurrentVideo((prev) => (prev + 1) % videos.length)
      }, 6000) // Change video every 6 seconds

      return () => clearInterval(interval)
    }
  }, [introPhase, videos.length])

  // Preload next video
  useEffect(() => {
    const nextVideoIndex = (currentVideo + 1) % videos.length
    const nextVideo = videoRefs.current[nextVideoIndex]
    if (nextVideo && nextVideo.readyState < 2) {
      nextVideo.load()
    }
  }, [currentVideo, videos.length])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      opacity: introPhase === 3 ? 1 : 0,
      transition: 'opacity 2s ease'
    }}>
      {/* Gradient backgrounds as fallback */}
      {gradients.map((gradient, index) => (
        <div
          key={`gradient-${index}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: gradient,
            opacity: currentVideo === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out',

          }}
        />
      ))}
      
      {/* Video layers */}
      {videos.map((videoSrc, index) => (
        <video
          key={index}
          ref={(el) => {
            videoRefs.current[index] = el
          }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: currentVideo === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out, transform 1.5s ease-in-out',
            transform: currentVideo === index ? 'scale(1)' : 'scale(1.05)',
            // filter: 'brightness(0.9) saturate(1.2) contrast(1.1)',
            zIndex: 1
          }}
          onLoadedData={() => {
            // Ensure video plays when it becomes active
            if (index === currentVideo && videoRefs.current[index]) {
              videoRefs.current[index]?.play().catch(() => {
                // Ignore play errors (common in browsers with autoplay restrictions)
              })
            }
          }}
          onError={() => {
            // If video fails to load, the gradient background will show instead
            console.log(`Video ${index} failed to load, using gradient fallback`)
          }}
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ))}
      
      {/* Video indicators */}
      <div style={{
        position: 'absolute',
        bottom: '2rem',
        right: '2rem',
        display: 'flex',
        gap: '0.5rem',
        zIndex: 2
      }}>
        {videos.map((_, index) => (
          <div
            key={index}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: currentVideo === index ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
              transition: 'background 0.3s ease',
              cursor: 'pointer'
            }}
            onClick={() => setCurrentVideo(index)}
          />
        ))}
      </div>
    </div>
  )
}

interface TurfBackgroundProps {
  scrollProgress: number
  introPhase: number
}

const TurfBackground: React.FC<TurfBackgroundProps> = ({ scrollProgress, introPhase }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
      background: '#000'
    }}>
      {/* Main turf image with scroll parallax */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '120%',
        backgroundImage: 'url(/images/turf.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        transform: `translateY(${scrollProgress * -30}px)`,
        willChange: 'transform'
      }} />
      
      {/* Simple lighting overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(180deg, rgba(0,0,0,${0.4 - scrollProgress * 0.2}) 0%, rgba(0,0,0,${0.2 - scrollProgress * 0.1}) 100%)`,
        opacity: 1 - scrollProgress * 0.3
      }} />
    </div>
  )
}

export default function Home() {
  const [introPhase, setIntroPhase] = useState(0) // 0: black, 1: logo forming, 2: logo complete, 3: content
  const [particles, setParticles] = useState<Particle[]>([])
  const [stars, setStars] = useState<Star[]>([])
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [turfScrollProgress, setTurfScrollProgress] = useState(0)

  const heroRef = useRef<HTMLDivElement>(null)
  const wellnessRef = useRef<HTMLElement>(null)

    useEffect(() => {
    setMounted(true)
    
    // Generate particles
    const newParticles: Particle[] = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 15 + Math.random() * 20,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.6 + 0.2,
      color: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.4 + 0.3})`
    }))
    setParticles(newParticles)

    // Generate stars
    const newStars: Star[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3
    }))
    setStars(newStars)

    // Smooth intro sequence with better transitions
    const timer1 = setTimeout(() => setIntroPhase(1), 600)   // Logo starts forming
    const timer2 = setTimeout(() => setIntroPhase(2), 1800)  // Logo complete with effects
    const timer3 = setTimeout(() => setIntroPhase(3), 2800)  // Smooth transition to content



    // Enhanced scroll tracking with turf animation
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrolled / maxScroll, 1)
      setScrollProgress(progress)

      // Calculate turf animation progress based on wellness section
      if (wellnessRef.current) {
        const wellnessTop = wellnessRef.current.offsetTop
        const wellnessHeight = wellnessRef.current.offsetHeight
        const viewportHeight = window.innerHeight
        
        // Start turf animation when wellness section enters viewport
        const turfStart = wellnessTop - viewportHeight
        const turfEnd = wellnessTop + wellnessHeight
        const turfProgress = Math.max(0, Math.min(1, (scrolled - turfStart) / (turfEnd - turfStart)))
        setTurfScrollProgress(turfProgress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      window.removeEventListener('scroll', handleScroll)
      }
    }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || isSubmitting) return
    
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSubmitted(true)
    setIsSubmitting(false)
  }



  return (
    <>
      {/* Preload critical content for better LCP */}
      <div style={{ display: 'none' }}>
        <span className="gradient-text lcp-optimized">Reimagined</span>
      </div>
      
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          overflow-x: hidden;
          background: #000;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          font-display: swap;
        }

        /* Preload critical styles for LCP */
        .lcp-optimized {
          font-size: clamp(3.5rem, 8vw, 6.5rem);
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          will-change: background-position;
          contain: layout style paint;
        }

        /* Enhanced intro animations */
        @keyframes logoMaterialize {
          0% {
            opacity: 0;
            transform: scale(0.5) rotateY(-180deg);
            filter: blur(20px);
            letter-spacing: 1rem;
          }
          60% {
            opacity: 0.8;
            transform: scale(1.1) rotateY(-20deg);
            filter: blur(5px);
            letter-spacing: 0.2rem;
          }
          100% {
            opacity: 1;
            transform: scale(1) rotateY(0deg);
            filter: blur(0);
            letter-spacing: 0;
          }
        }

        @keyframes logoComplete {
          0%, 100% {
            transform: scale(1);
            filter: brightness(1) saturate(1);
          }
          50% {
            transform: scale(1.05);
            filter: brightness(1.3) saturate(1.2);
          }
        }

        @keyframes particleBurst {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            opacity: 1;
            transform: scale(1.5);
          }
          100% {
            opacity: 0;
            transform: scale(3);
          }
        }

        @keyframes contentSlideUp {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes logoTransition {
          0% {
            transform: scale(1);
            opacity: 1;
            filter: brightness(1);
          }
          40% {
            transform: scale(1.2);
            opacity: 1;
            filter: brightness(1.5) saturate(1.3);
          }
          70% {
            transform: scale(0.8);
            opacity: 0.8;
            filter: brightness(0.7) saturate(0.8);
          }
          100% {
            transform: scale(0.6);
            opacity: 0;
            filter: brightness(0.3) saturate(0.5);
          }
        }

        @keyframes grassSway {
          0%, 100% {
            transform: translateX(0) rotate(-2deg) scaleY(1);
          }
          25% {
            transform: translateX(2px) rotate(1deg) scaleY(1.05);
          }
          50% {
            transform: translateX(0) rotate(2deg) scaleY(0.98);
          }
          75% {
            transform: translateX(-2px) rotate(-1deg) scaleY(1.02);
          }
        }

        @keyframes smoothContentReveal {
          0% {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(40px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes floatComplex {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) translateX(10px) rotate(2deg);
          }
          66% {
            transform: translateY(10px) translateX(-10px) rotate(-2deg);
          }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(102, 126, 234, 0.6);
          }
        }

        @keyframes rotate3D {
          0% {
            transform: perspective(1000px) rotateY(0deg);
          }
          100% {
            transform: perspective(1000px) rotateY(360deg);
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes ringExpand {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(3);
            opacity: 0;
          }
        }

        @keyframes videoSlideIn {
          0% {
            opacity: 0;
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes videoSlideOut {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.9), 0 8px 30px rgba(0, 0, 0, 0.7), 0 16px 60px rgba(0, 0, 0, 0.5);
          }
          50% {
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95), 0 8px 30px rgba(0, 0, 0, 0.8), 0 16px 60px rgba(0, 0, 0, 0.6), 0 0 80px rgba(102, 126, 234, 0.4);
          }
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease infinite;
          will-change: background-position;
          transform: translateZ(0);
        }

        .glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px) saturate(180%);
          -webkit-backdrop-filter: blur(10px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card-hover {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }

        .card-hover:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
        }

        /* Scroll indicator */
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          z-index: 10000;
          transition: width 0.2s ease;
        }

        /* Button animations */
        button {
          transition: all 0.3s ease;
          cursor: pointer;
        }

        button:hover {
          transform: translateY(-2px) scale(1.05);
        }

        button:active {
          transform: translateY(0) scale(0.98);
        }

        /* Input styles */
        input {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          outline: none;
          border: none;
          box-shadow: none;
        }

        input:focus {
          outline: none;
          border: none;
          box-shadow: none;
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.5);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes successPop {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .success-pop {
          animation: successPop 0.5s ease-out forwards;
        }

        .content-slide-up {
          animation: smoothContentReveal 1s cubic-bezier(0.23, 1, 0.320, 1) forwards;
        }

        .content-slide-up-delay-100 {
          animation: smoothContentReveal 1s cubic-bezier(0.23, 1, 0.320, 1) forwards;
          animation-delay: 150ms;
        }

        .content-slide-up-delay-200 {
          animation: smoothContentReveal 1s cubic-bezier(0.23, 1, 0.320, 1) forwards;
          animation-delay: 300ms;
        }

        .content-slide-up-delay-300 {
          animation: smoothContentReveal 1s cubic-bezier(0.23, 1, 0.320, 1) forwards;
          animation-delay: 450ms;
        }

        .fade-in-delay-400 {
          animation: smoothContentReveal 1s cubic-bezier(0.23, 1, 0.320, 1) forwards;
          animation-delay: 600ms;
        }

        .fade-in-delay-500 {
          animation: smoothContentReveal 1s cubic-bezier(0.23, 1, 0.320, 1) forwards;
          animation-delay: 750ms;
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-400 { animation-delay: 400ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-600 { animation-delay: 600ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-800 { animation-delay: 800ms; }
        .delay-900 { animation-delay: 900ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>



      {/* Scroll Progress */}
      {mounted && introPhase === 3 && (
        <div 
          className="scroll-progress" 
          style={{ width: `${scrollProgress * 100}%` }}
        />
      )}





      {/* Enhanced Intro Animation */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#000',
        zIndex: 9999,
        display: introPhase === 3 ? 'none' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 1s cubic-bezier(0.23, 1, 0.320, 1)',
        opacity: introPhase === 3 ? 0 : 1,
        transform: introPhase === 3 ? 'scale(1.05)' : 'scale(1)',
        filter: introPhase === 3 ? 'blur(15px)' : 'blur(0)'
      }}>
        {/* Animated star field */}
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              width: `${star.size}px`,
              height: `${star.size}px`,
              background: 'white',
              borderRadius: '50%',
              left: `${star.left}%`,
              top: `${star.top}%`,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              opacity: introPhase >= 1 ? 1 : 0,
              transition: 'opacity 0.5s ease'
            }}
          />
        ))}

        {/* Intro background effects */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          opacity: introPhase >= 1 ? 0.8 : 0,
          transition: 'opacity 1s ease',
          animation: introPhase >= 2 ? 'floatComplex 8s ease-in-out infinite' : 'none'
        }} />

        {/* Logo with enhanced effects */}
        <div style={{
          position: 'relative',
          textAlign: 'center'
        }}>
          {/* Expanding rings effect */}
          {introPhase >= 2 && (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: `${150 + i * 100}px`,
                    height: `${150 + i * 100}px`,
                    border: `1px solid rgba(102, 126, 234, ${0.4 - i * 0.1})`,
                    borderRadius: '50%',
                    animation: `ringExpand ${2 + i * 0.5}s ease-out infinite`,
                    animationDelay: `${i * 0.3}s`
                  }}
                />
              ))}
            </>
          )}

          {/* Particle burst during logo completion */}
          {introPhase >= 2 && (
            <>
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '4px',
                    height: '4px',
                    background: `hsl(${220 + i * 15}, 70%, 70%)`,
                    borderRadius: '50%',
                    animation: 'particleBurst 1.5s ease-out infinite',
                    animationDelay: `${i * 100}ms`,
                    transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateX(80px)`,
                    boxShadow: '0 0 10px currentColor'
                  }}
                />
              ))}
            </>
          )}

          <h1 style={{
            fontSize: 'clamp(4rem, 10vw, 6rem)',
            fontWeight: '900',
            letterSpacing: introPhase >= 2 ? '0' : '1rem',
            margin: 0,
            animation: introPhase >= 1 ? (
              introPhase === 3 ? 'logoTransition 0.8s cubic-bezier(0.23, 1, 0.320, 1) forwards' :
              introPhase >= 2 ? 'logoComplete 2s ease-in-out infinite' : 
              'logoMaterialize 1.4s cubic-bezier(0.23, 1, 0.320, 1) forwards'
            ) : 'none',
            opacity: introPhase >= 1 ? 1 : 0,
            transformStyle: 'preserve-3d'
          }}>
            <span className="gradient-text" style={{
              display: 'inline-block',
              filter: introPhase >= 2 ? 'drop-shadow(0 0 30px rgba(102, 126, 234, 0.6))' : 'none',
              textShadow: introPhase >= 2 ? '0 0 50px rgba(102, 126, 234, 0.5)' : 'none'
            }}>
              VORA
            </span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        minHeight: '100vh',
        backgroundColor: '#000',
        color: 'white',
        opacity: introPhase === 3 ? 1 : 0,
        transform: introPhase === 3 ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)',
        filter: introPhase === 3 ? 'blur(0)' : 'blur(10px)',
        transition: 'all 1.2s cubic-bezier(0.23, 1, 0.320, 1)',
        transitionDelay: introPhase === 3 ? '0.2s' : '0s'
      }}>
        
        {/* Hidden LCP element for faster loading */}
        <div style={{ 
          position: 'absolute', 
          opacity: 0, 
          pointerEvents: 'none',
          fontSize: 'clamp(3.5rem, 8vw, 6.5rem)',
          fontWeight: '700'
        }}>
          <span className="lcp-optimized">Reimagined</span>
        </div>
        {/* Enhanced Star Field */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          opacity: introPhase === 3 ? 0.8 : 0,
          transition: 'opacity 1.5s ease',
          transitionDelay: '1s'
        }}>
          {stars.map((star) => (
            <div
              key={star.id}
              style={{
                position: 'absolute',
                width: `${star.size}px`,
                height: `${star.size}px`,
                background: 'white',
                borderRadius: '50%',
                left: `${star.left}%`,
                top: `${star.top}%`,
                animation: `twinkle ${star.duration}s ease-in-out infinite`,
                animationDelay: `${star.delay}s`,
                boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.5)`,

              }}
            />
          ))}
        </div>

        {/* Interactive Background Particles */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          opacity: introPhase === 3 ? 0.7 : 0,
          transition: 'opacity 1s ease',
          transitionDelay: '1s'
        }}>
          {particles.map((particle) => (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                background: particle.color,
                borderRadius: '50%',
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animation: `floatComplex ${particle.duration}s ease-in-out infinite`,
                animationDelay: `${particle.delay}s`,
                boxShadow: `0 0 ${particle.size * 4}px ${particle.color}`,

              }}
            />
          ))}
        </div>

        {/* Hero Section with Video Slideshow */}
        <section ref={heroRef} style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Video Slideshow Background */}
          <VideoSlideshow introPhase={introPhase} />

          {/* Enhanced overlay for better text readability */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)',
            zIndex: 1,
            opacity: introPhase === 3 ? 1 : 0,
            transition: 'opacity 2s ease',
            transitionDelay: '1s'
          }} />
          
          {/* Additional vignette overlay for focus */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.3) 100%)',
            zIndex: 2,
            opacity: introPhase === 3 ? 1 : 0,
            transition: 'opacity 2s ease',
            transitionDelay: '1.2s'
          }} />

          <div style={{
            maxWidth: '1000px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 10,

          }}>
            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              marginBottom: '2rem',
              letterSpacing: '-0.02em',
              opacity: introPhase === 3 ? 1 : 0,
              textShadow: '0 4px 20px rgba(0, 0, 0, 1), 0 8px 40px rgba(0, 0, 0, 0.8)'
            }}>
              <div className={introPhase === 3 ? 'content-slide-up' : ''} style={{
                opacity: introPhase === 3 ? 1 : 0,
                marginBottom: '0.5rem'
              }}>
                Your Health Journey
              </div>
              <div className={introPhase === 3 ? 'content-slide-up-delay-100' : ''} style={{
                opacity: introPhase === 3 ? 1 : 0
              }}>
                <span style={{
                  color: '#a855f7',
                  fontSize: 'inherit',
                  fontWeight: 'inherit'
                }}>
                  Reimagined
                </span>
              </div>
            </h1>

            {/* Subheadline */}
            <p className={introPhase === 3 ? 'content-slide-up-delay-200' : ''} style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '3rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 3rem auto',
              opacity: introPhase === 3 ? 1 : 0,
              textShadow: '0 2px 10px rgba(0, 0, 0, 1), 0 4px 20px rgba(0, 0, 0, 0.8)'
            }}>
              The AI wellness coach that actually understands you. 
              Get personalized insights and achieve sustainable health outcomes.
            </p>

            {/* Email Signup */}
            <div className={introPhase === 3 ? 'content-slide-up-delay-300' : ''} style={{
              opacity: introPhase === 3 ? 1 : 0,
              marginTop: '2rem'
            }}>
              {!submitted ? (
                <form onSubmit={handleSubmit} style={{
                  display: 'inline-flex',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px',
                  borderRadius: '60px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                }}>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      background: 'transparent',
                      border: 'none',
                      padding: '16px 24px',
                      color: 'white',
                      fontSize: '16px',
                      width: '280px',
                      fontFamily: 'inherit'
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      background: 'white',
                      color: '#000',
                      border: 'none',
                      padding: '16px 32px',
                      borderRadius: '50px',
                      fontWeight: '600',
                      fontSize: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      minWidth: '120px',
                      justifyContent: 'center'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid #ccc',
                          borderTopColor: '#000',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                        <span>...</span>
                      </>
                    ) : (
                      'Get Access'
                    )}
                  </button>
                </form>
              ) : (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  padding: '16px 32px',
                  borderRadius: '60px',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  backdropFilter: 'blur(20px)'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: '#22c55e',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                  <span style={{ color: 'white', fontSize: '16px' }}>
                    Thanks! Check your email.
                  </span>
                </div>
              )}
            </div>




          </div>
        </section>

        {/* Clean Turf Section */}
        <section ref={wellnessRef} style={{
          height: '100vh',
          position: 'relative',
          overflow: 'hidden',
          background: '#000'
        }}>
          {/* Turf Background Animation */}
          <TurfBackground scrollProgress={turfScrollProgress} introPhase={introPhase} />
        </section>
        
        {/* AI Preview Section */}
        <section style={{
          padding: '6rem 2rem',
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(102, 126, 234, 0.05) 50%, rgba(0, 0, 0, 0) 100%)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
            gap: '4rem',
            alignItems: 'center'
          }}>
            {/* Left: Chat Interface */}
            <div className="glass" style={{
              padding: '2rem',
              borderRadius: '2rem',
              position: 'relative',
              height: '600px',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.05))',
                borderRadius: '2rem'
              }} />
              
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '2rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
                  }}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      background: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '50%',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '4px',
                        height: '4px',
                        background: '#667eea',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '6px',
                        left: '6px',
                        animation: 'glow 2s ease-in-out infinite'
                      }} />
                    </div>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>Vora AI</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>Your wellness coach</div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { user: true, text: "I&apos;ve been feeling tired lately. Any suggestions?" },
                    { user: false, text: "I noticed your sleep quality has decreased this week. Let&apos;s work on your bedtime routine. Based on your data, I recommend..." },
                    { user: true, text: "That makes sense! What about my nutrition?" },
                    { user: false, text: "Great question! I see you&apos;ve been missing key nutrients. Here&apos;s a personalized meal plan..." }
                  ].map((message, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      justifyContent: message.user ? 'flex-end' : 'flex-start',
                      animation: `fadeInUp 0.6s ease forwards`,
                      animationDelay: `${i * 200}ms`,
                      opacity: 0
                    }}>
                      <div style={{
                        maxWidth: '80%',
                        padding: '1rem',
                        borderRadius: '1rem',
                        background: message.user 
                          ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                          : 'rgba(255, 255, 255, 0.05)',
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                      }}>
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              </div>
              
            {/* Right: Features */}
            <div>
              <h3 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '1.5rem'
              }}>
                Meet Your AI Coach
              </h3>
              <p style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '2rem',
                lineHeight: '1.6'
              }}>
                Vora learns from your habits, preferences, and goals to provide 
                personalized guidance that actually works for your lifestyle.
              </p>

              {/* Feature List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Personalized health insights based on your data',
                  'Real-time coaching and motivation',
                  'Integration with your favorite health apps',
                  'Privacy-first approach to your sensitive data'
                ].map((feature, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '1rem',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      ✓
                    </div>
                    <span style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section style={{
          padding: '6rem 2rem',
          position: 'relative'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h2 className="gradient-text" style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '800',
              marginBottom: '4rem'
            }}>
              What Early Users Say
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {[
                {
                  name: "Sarah Chen",
                  role: "Product Manager",
                  text: "Vora completely changed how I approach wellness. It&apos;s like having a personal health scientist.",
                  initials: "SC",
                  color: "linear-gradient(135deg, #667eea, #764ba2)"
                },
                {
                  name: "Marcus Rodriguez",
                  role: "Software Engineer", 
                  text: "Finally, an AI that doesn&apos;t feel robotic. Vora actually gets my lifestyle and constraints.",
                  initials: "MR",
                  color: "linear-gradient(135deg, #f093fb, #f5576c)"
                },
                {
                  name: "Dr. Emily Watson",
                  role: "Physician",
                  text: "The insights Vora provides are remarkably accurate. It&apos;s the future of preventive healthcare.",
                  initials: "EW",
                  color: "linear-gradient(135deg, #4facfe, #00f2fe)"
                }
              ].map((testimonial, index) => (
                <div key={index} className="glass card-hover" style={{
                  padding: '2rem',
                  borderRadius: '2rem',
                  textAlign: 'left',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: testimonial.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: '1.5rem',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                  }}>
                    {testimonial.initials}
                  </div>
                  <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    &ldquo;{testimonial.text}&rdquo;
                  </p>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      {testimonial.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '6rem 2rem',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(240, 147, 251, 0.05))',
          position: 'relative'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: '800',
              marginBottom: '1rem'
            }}>
              Ready to Transform Your{' '}
              <span className="gradient-text">Health?</span>
            </h2>
            <p style={{
              fontSize: '1.2rem',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '3rem',
              lineHeight: '1.6'
            }}>
              Join thousands who are already experiencing the future of wellness.
              Get early access and exclusive features.
            </p>

            <div className="glass" style={{
              display: 'inline-flex',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '2rem',
              position: 'relative',
              overflow: 'hidden',
              maxWidth: '500px',
              width: '100%'
            }}>
              <input
                type="email"
                placeholder="Enter your email for early access"
                style={{
                  flex: 1,
                  padding: '1rem 1.5rem',
                  background: 'transparent',
                  border: 'none',
                  color: 'white',
                  fontSize: '1rem',
                  fontFamily: 'inherit'
                }}
              />
              <button style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '1.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                animation: 'glow 3s ease infinite'
              }}>
                Join Waitlist
              </button>
            </div>

            <div style={{
              marginTop: '2rem',
              fontSize: '0.9rem',
              color: 'rgba(255, 255, 255, 0.5)'
            }}>
              No spam, unsubscribe at any time
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{
          padding: '4rem 2rem 2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'relative'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '3rem',
              marginBottom: '3rem'
            }}>
              {/* Brand */}
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)'
                  }} />
                  <span className="gradient-text" style={{
                    fontSize: '2rem',
                    fontWeight: '800'
                  }}>
                    VORA
                  </span>
                </div>
                <p style={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: '1.6'
                }}>
                  The AI wellness coach that actually cares about your health journey.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 style={{
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  Product
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['Features', 'Pricing', 'Security', 'API'].map(link => (
                    <a key={link} href="#" style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  Company
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['About', 'Blog', 'Careers', 'Contact'].map(link => (
                    <a key={link} href="#" style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)'
                }}>
                  Legal
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {['Privacy', 'Terms', 'Security', 'GDPR'].map(link => (
                    <a key={link} href="#" style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease'
                    }}>
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <p style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.9rem'
              }}>
                © 2024 Vora. All rights reserved.
              </p>
              <div style={{
                display: 'flex',
                gap: '1rem'
              }}>
                {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                  <a key={social} href="#" style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease'
                  }}>
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
} 