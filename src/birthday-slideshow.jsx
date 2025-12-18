import React, { useState, useEffect, useCallback } from 'react';

// Replace these with your actual photos and captions
const slides = [
  {
    image: 'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1200&h=800&fit=crop',
    caption: 'The day we first met — my heart knew before my mind did 💕'
  },
  {
    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=1200&h=800&fit=crop',
    caption: 'Our first adventure together — the beginning of forever'
  },
  {
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1200&h=800&fit=crop',
    caption: 'Every moment with you feels like magic ✨'
  },
  {
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1200&h=800&fit=crop',
    caption: 'Through every season, my love for you only grows'
  },
  {
    image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=1200&h=800&fit=crop',
    caption: 'Happy Birthday to my favorite person in the world! 🎂'
  }
];

const PlayIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

const PauseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#e8a4b8' }}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export default function BirthdaySlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const goToNext = useCallback(() => {
    setIsTransitioning(true);
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const goToPrev = useCallback(() => {
    setIsTransitioning(true);
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 400);
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(goToNext, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, goToNext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  const currentSlide = slides[currentIndex];

  return (
    <div style={styles.container}>
      {/* Floating hearts background */}
      <div style={styles.heartsContainer}>
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.floatingHeart,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
              fontSize: `${16 + Math.random() * 24}px`,
              opacity: 0.15 + Math.random() * 0.15
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Main content */}
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerDecor}>✦</div>
          <h1 style={styles.title}>Happy Birthday, My Love</h1>
          <div style={styles.headerDecor}>✦</div>
        </div>

        {/* Slideshow frame */}
        <div style={styles.frameOuter}>
          <div style={styles.frameInner}>
            <div style={styles.imageContainer}>
              <img
                src={currentSlide.image}
                alt={currentSlide.caption}
                style={{
                  ...styles.image,
                  opacity: isTransitioning ? 0 : imageLoaded ? 1 : 0,
                  transform: isTransitioning ? 'scale(1.05)' : 'scale(1)'
                }}
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Image overlay gradient */}
              <div style={styles.imageOverlay} />
              
              {/* Slide counter */}
              <div style={styles.slideCounter}>
                {currentIndex + 1} / {slides.length}
              </div>
            </div>
          </div>
        </div>

        {/* Caption area */}
        <div style={styles.captionContainer}>
          <div style={styles.captionDecorLeft}><HeartIcon /></div>
          <p style={{
            ...styles.caption,
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)'
          }}>
            {currentSlide.caption}
          </p>
          <div style={styles.captionDecorRight}><HeartIcon /></div>
        </div>

        {/* Progress dots */}
        <div style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setImageLoaded(false);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 400);
              }}
              style={{
                ...styles.dot,
                ...(index === currentIndex ? styles.dotActive : {})
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <button
            onClick={goToPrev}
            style={styles.navButton}
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>
          
          <button
            onClick={togglePlay}
            style={styles.playButton}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span style={styles.playButtonText}>
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>
          
          <button
            onClick={goToNext}
            style={styles.navButton}
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
        </div>

        {/* Footer message */}
        <div style={styles.footer}>
          <p style={styles.footerText}>Made with all my love, just for you ♥</p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Quicksand:wght@400;500&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        button:hover {
          transform: scale(1.05);
        }
        
        button:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fdf6f8 0%, #f8e8ed 25%, #fdf2f5 50%, #f5e6eb 75%, #fdf6f8 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: '"Quicksand", sans-serif'
  },
  heartsContainer: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    overflow: 'hidden'
  },
  floatingHeart: {
    position: 'absolute',
    bottom: '-50px',
    color: '#d4a5b5',
    animation: 'float linear infinite',
    pointerEvents: 'none'
  },
  content: {
    maxWidth: '900px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    position: 'relative',
    zIndex: 1
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '8px'
  },
  headerDecor: {
    color: '#c9929f',
    fontSize: '20px',
    animation: 'shimmer 2s ease-in-out infinite'
  },
  title: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: 'clamp(32px, 6vw, 52px)',
    fontWeight: '600',
    color: '#8b5a6b',
    margin: 0,
    textAlign: 'center',
    letterSpacing: '0.02em',
    textShadow: '0 2px 20px rgba(200, 150, 170, 0.3)'
  },
  frameOuter: {
    background: 'linear-gradient(145deg, #ffffff, #f8e8ed)',
    padding: '12px',
    borderRadius: '20px',
    boxShadow: '0 25px 80px rgba(180, 130, 150, 0.25), 0 10px 30px rgba(200, 150, 170, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    position: 'relative'
  },
  frameInner: {
    background: '#fff',
    padding: '8px',
    borderRadius: '12px',
    boxShadow: 'inset 0 2px 8px rgba(180, 130, 150, 0.1)'
  },
  imageContainer: {
    position: 'relative',
    width: 'clamp(300px, 75vw, 800px)',
    height: 'clamp(225px, 50vw, 500px)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f8e8ed'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'opacity 0.4s ease, transform 0.4s ease'
  },
  imageOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to bottom, transparent 70%, rgba(139, 90, 107, 0.1) 100%)',
    pointerEvents: 'none'
  },
  slideCounter: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(8px)',
    padding: '6px 14px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#8b5a6b',
    boxShadow: '0 2px 12px rgba(180, 130, 150, 0.2)'
  },
  captionContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    maxWidth: '700px',
    padding: '0 20px'
  },
  captionDecorLeft: {
    flexShrink: 0,
    animation: 'pulse 2s ease-in-out infinite'
  },
  captionDecorRight: {
    flexShrink: 0,
    animation: 'pulse 2s ease-in-out infinite',
    animationDelay: '1s'
  },
  caption: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: 'clamp(18px, 3vw, 24px)',
    fontStyle: 'italic',
    color: '#6b4a5a',
    textAlign: 'center',
    margin: 0,
    lineHeight: 1.6,
    transition: 'opacity 0.4s ease, transform 0.4s ease'
  },
  dotsContainer: {
    display: 'flex',
    gap: '10px',
    padding: '8px 0'
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    border: '2px solid #c9929f',
    background: 'transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    padding: 0
  },
  dotActive: {
    background: 'linear-gradient(135deg, #d4a5b5, #c9929f)',
    transform: 'scale(1.2)',
    boxShadow: '0 0 12px rgba(201, 146, 159, 0.5)'
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '8px'
  },
  navButton: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    border: 'none',
    background: 'linear-gradient(145deg, #ffffff, #f8e8ed)',
    color: '#8b5a6b',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(180, 130, 150, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
    transition: 'all 0.2s ease'
  },
  playButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 28px',
    borderRadius: '30px',
    border: 'none',
    background: 'linear-gradient(135deg, #d4a5b5, #c9929f)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500',
    fontFamily: '"Quicksand", sans-serif',
    boxShadow: '0 6px 24px rgba(201, 146, 159, 0.4)',
    transition: 'all 0.2s ease'
  },
  playButtonText: {
    letterSpacing: '0.05em'
  },
  footer: {
    marginTop: '16px',
    opacity: 0.8
  },
  footerText: {
    fontFamily: '"Cormorant Garamond", serif',
    fontSize: '16px',
    color: '#9b7a8a',
    fontStyle: 'italic',
    margin: 0
  }
};
