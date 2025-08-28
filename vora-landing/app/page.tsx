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

export default function Home() {
  const [introPhase, setIntroPhase] = useState(0) // 0: black, 1: logo forming, 2: logo complete, 3: content
  const [particles, setParticles] = useState<Particle[]>([])
  const [stars, setStars] = useState<Star[]>([])
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)

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

    // Mouse tracking for parallax effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Scroll tracking
    const handleScroll = () => {
      const scrolled = window.scrollY
      setScrollY(scrolled)
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = Math.min(scrolled / maxScroll, 1)
      setScrollProgress(progress)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll, { passive: true })

      return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      window.removeEventListener('mousemove', handleMouseMove)
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

  // Parallax calculations
  const parallaxX = mounted ? (mousePosition.x - window.innerWidth / 2) / 30 : 0
  const parallaxY = mounted ? (mousePosition.y - window.innerHeight / 2) / 30 : 0

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
          cursor: none;
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

      {/* Custom Mouse Cursor */}
      {mounted && introPhase === 3 && (
        <>
          <div style={{
            position: 'fixed',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 10001,
            transform: `translate(${mousePosition.x - 10}px, ${mousePosition.y - 10}px)`,
            transition: 'transform 0.1s ease-out',
            mixBlendMode: 'screen'
          }} />
          
          <div style={{
            position: 'fixed',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid rgba(102, 126, 234, 0.3)',
            pointerEvents: 'none',
            zIndex: 10000,
            transform: `translate(${mousePosition.x - 20}px, ${mousePosition.y - 20}px)`,
            transition: 'transform 0.2s ease-out'
          }} />
        </>
      )}

      {/* Scroll Progress */}
      {mounted && introPhase === 3 && (
        <div 
          className="scroll-progress" 
          style={{ width: `${scrollProgress * 100}%` }}
        />
      )}

      {/* Smooth Transition Overlay */}
      {introPhase === 3 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(102, 126, 234, 0.1) 0%, transparent 70%)',
          zIndex: 9998,
          opacity: 1,
          animation: 'fadeIn 0.8s ease-out forwards'
        }} />
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
                transform: `translate(${parallaxX * (star.size / 2)}px, ${parallaxY * (star.size / 2)}px)`
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
                transform: `translate(${parallaxX * (particle.size / 3)}px, ${parallaxY * (particle.size / 3)}px)`
              }}
            />
          ))}
        </div>

        {/* Hero Section */}
        <section ref={heroRef} style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          position: 'relative',
          background: mounted ? `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, rgba(102, 126, 234, 0.15), transparent)` : 'none',
          transition: 'background 0.3s ease'
        }}>
          {/* Moving grid background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(rgba(102, 126, 234, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(102, 126, 234, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: `perspective(1000px) rotateX(60deg) translateY(${scrollY * 0.5}px)`,
            transformOrigin: 'center center',
            opacity: 0.4,
            animation: 'fadeIn 2s ease-out',
            animationDelay: '2s'
          }} />

          {/* Dynamic gradient background */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            right: '-50%',
            bottom: '-50%',
            background: `
              radial-gradient(circle at ${30 + parallaxX / 10}% ${40 + parallaxY / 10}%, rgba(102, 126, 234, 0.12) 0%, transparent 50%), 
              radial-gradient(circle at ${70 - parallaxX / 10}% ${80 - parallaxY / 10}%, rgba(240, 147, 251, 0.08) 0%, transparent 50%)
            `,
            filter: 'blur(100px)',
            animation: 'gradientShift 25s ease infinite',
            opacity: introPhase === 3 ? 1 : 0,
            transition: 'opacity 2s ease',
            transitionDelay: '1s'
          }} />

          <div style={{
            maxWidth: '1000px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            transform: `translate(${parallaxX * -0.5}px, ${parallaxY * -0.5}px)`
          }}>
            {/* Main Headline */}
            <h1 style={{
              fontSize: 'clamp(3rem, 7vw, 5.5rem)',
              fontWeight: '800',
              lineHeight: '1',
              marginBottom: '2rem',
              letterSpacing: '-0.02em',
              opacity: introPhase === 3 ? 1 : 0
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
                <span className="gradient-text lcp-optimized" style={{
                  filter: 'drop-shadow(0 4px 20px rgba(102, 126, 234, 0.4))',
                  textShadow: '0 0 40px rgba(102, 126, 234, 0.3)',
                  animation: 'gradientShift 4s ease infinite'
                }}>
                  Reimagined
                </span>
              </div>
            </h1>

            {/* Subheadline */}
            <p className={introPhase === 3 ? 'content-slide-up-delay-200' : ''} style={{
              fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
              color: 'rgba(255, 255, 255, 0.8)',
              marginBottom: '3rem',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 3rem auto',
              opacity: introPhase === 3 ? 1 : 0
            }}>
              The AI wellness coach that actually understands you. 
              Get personalized insights and achieve sustainable health outcomes.
            </p>

            {/* Clean Email Form */}
            <form onSubmit={handleSubmit} className={introPhase === 3 ? 'content-slide-up-delay-300' : ''} style={{
              maxWidth: '500px',
              margin: '0 auto 3rem auto',
              opacity: introPhase === 3 ? 1 : 0,
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              {!submitted ? (
                <>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="glass"
                    style={{
                      flex: 1,
                      padding: '1rem 1.5rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '1rem',
                      color: 'white',
                      fontSize: '1rem',
                      fontFamily: 'inherit'
                    }}
                  />
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      padding: '1rem 2rem',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '1rem',
                      fontWeight: '600',
                      fontSize: '1rem',
                      minWidth: '140px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: isSubmitting ? 0.7 : 1,
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite'
                        }} />
                        Joining...
                      </>
                    ) : (
                      'Join Waitlist'
                    )}
                  </button>
                </>
              ) : (
                <div className="glass success-pop" style={{
                  padding: '2rem',
                  borderRadius: '1.5rem',
                  border: '1px solid rgba(67, 233, 123, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  background: 'rgba(67, 233, 123, 0.05)'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    background: '#4ade80',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '6px',
                      borderLeft: '2px solid white',
                      borderBottom: '2px solid white',
                      transform: 'rotate(-45deg)',
                      marginTop: '-2px'
                    }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                      Welcome to the future of wellness!
                    </div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      Check your email for confirmation.
                    </div>
                  </div>
                </div>
              )}
            </form>



            {/* Enhanced Scroll Indicator */}
            <div className={introPhase === 3 ? 'fade-in-delay-500' : ''} style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              opacity: introPhase === 3 ? 0.6 : 0
            }}>
              <div style={{
                width: '24px',
                height: '40px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                padding: '8px',
                animation: 'gentleFloat 3s ease-in-out infinite',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{
                  width: '2px',
                  height: '8px',
                  background: 'white',
                  borderRadius: '1px',
                  animation: 'fadeIn 1s ease-in-out infinite alternate'
                }} />
              </div>
            </div>
          </div>
        </section>

        {/* Apple-Style Experience Section */}
        <section style={{
          padding: '8rem 2rem',
          position: 'relative'
        }}>
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: 'clamp(2.5rem, 6vw, 3.5rem)',
              fontWeight: '600',
              marginBottom: '6rem',
              color: 'white',
              letterSpacing: '-0.01em'
            }}>
              Wellness that works with your life.
            </h2>

            {/* Clean, Apple-style feature presentations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
              
              {/* Feature 1: AI Understanding */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    color: 'white'
                  }}>
                    AI that actually gets you.
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                  }}>
                    No more generic advice. Vora learns your patterns, preferences, 
                    and lifestyle to provide guidance that actually fits your reality.
                  </p>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: '500'
                  }}>
                    Powered by advanced machine learning
                  </div>
                </div>
                
                <div className="glass" style={{
                  padding: '3rem',
                  borderRadius: '2rem',
                  background: 'rgba(102, 126, 234, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    fontSize: '4rem',
                    marginBottom: '2rem',
                    filter: 'drop-shadow(0 4px 20px rgba(102, 126, 234, 0.3))'
                  }}>
                    🧠
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: 'rgba(255, 255, 255, 0.8)',
                    textAlign: 'center'
                  }}>
                    "Based on your sleep patterns and stress levels, 
                    I recommend adjusting your evening routine..."
                  </div>
                </div>
              </div>

              {/* Feature 2: Privacy */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
              }}>
                                 <div className="glass" style={{
                   padding: '3rem',
                   borderRadius: '2rem',
                   background: 'rgba(79, 172, 254, 0.05)',
                   position: 'relative'
                 }}>
                  <div style={{
                    fontSize: '4rem',
                    marginBottom: '2rem',
                    filter: 'drop-shadow(0 4px 20px rgba(79, 172, 254, 0.3))'
                  }}>
                    🔒
                  </div>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    textAlign: 'center',
                    fontFamily: 'Monaco, monospace'
                  }}>
                    End-to-end encrypted • Zero data selling • GDPR compliant
                  </div>
                </div>

                                 <div style={{ 
                   textAlign: 'left'
                 }}>
                  <h3 style={{
                    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    color: 'white'
                  }}>
                    Your data. Your control.
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                  }}>
                    Built privacy-first from day one. Your health data never leaves 
                    your device without your explicit consent.
                  </p>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: '500'
                  }}>
                    Enterprise-grade security
                  </div>
                </div>
              </div>

              {/* Feature 3: Real-time */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '4rem',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'left' }}>
                  <h3 style={{
                    fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                    color: 'white'
                  }}>
                    Guidance when you need it.
                  </h3>
                  <p style={{
                    fontSize: '1.1rem',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.6',
                    marginBottom: '2rem'
                  }}>
                    Real-time insights and gentle nudges that help you make 
                    better choices throughout your day, not just during workouts.
                  </p>
                  <div style={{
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontWeight: '500'
                  }}>
                    Available 24/7
                  </div>
                </div>
                
                <div className="glass" style={{
                  padding: '3rem',
                  borderRadius: '2rem',
                  background: 'rgba(67, 233, 123, 0.05)',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    fontSize: '2rem',
                    filter: 'drop-shadow(0 4px 20px rgba(67, 233, 123, 0.3))'
                  }}>
                    ⚡
                  </div>
                  <div style={{
                    padding: '1rem 2rem',
                    background: 'rgba(67, 233, 123, 0.1)',
                    borderRadius: '2rem',
                    border: '1px solid rgba(67, 233, 123, 0.2)',
                    fontSize: '0.9rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                    textAlign: 'center'
                  }}>
                    💡 It's 2:30 PM and your energy is dipping. 
                    Try a 5-minute walk or some deep breathing.
                  </div>
                </div>
              </div>
            </div>
          </div>
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
                    fontSize: '1.2rem'
                  }}>
                    🤖
                  </div>
                  <div>
                    <div style={{ fontWeight: '600' }}>Vora AI</div>
                    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.5)' }}>Your wellness coach</div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { user: true, text: "I've been feeling tired lately. Any suggestions?" },
                    { user: false, text: "I noticed your sleep quality has decreased this week. Let's work on your bedtime routine. Based on your data, I recommend..." },
                    { user: true, text: "That makes sense! What about my nutrition?" },
                    { user: false, text: "Great question! I see you've been missing key nutrients. Here's a personalized meal plan..." }
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
                  text: "Vora completely changed how I approach wellness. It's like having a personal health scientist.",
                  avatar: "👩‍💼"
                },
                {
                  name: "Marcus Rodriguez",
                  role: "Software Engineer", 
                  text: "Finally, an AI that doesn't feel robotic. Vora actually gets my lifestyle and constraints.",
                  avatar: "👨‍💻"
                },
                {
                  name: "Dr. Emily Watson",
                  role: "Physician",
                  text: "The insights Vora provides are remarkably accurate. It's the future of preventive healthcare.",
                  avatar: "👩‍⚕️"
                }
              ].map((testimonial, index) => (
                <div key={index} className="glass card-hover" style={{
                  padding: '2rem',
                  borderRadius: '2rem',
                  textAlign: 'left',
                  position: 'relative'
                }}>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '1rem'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    color: 'rgba(255, 255, 255, 0.9)'
                  }}>
                    "{testimonial.text}"
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