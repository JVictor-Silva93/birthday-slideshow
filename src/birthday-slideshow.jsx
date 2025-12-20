import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './birthday-slideshow.css';

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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export default function BirthdaySlideshow() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load slides from localStorage on mount
  useEffect(() => {
    const savedSlides = localStorage.getItem('birthdaySlides');
    if (savedSlides) {
      setSlides(JSON.parse(savedSlides));
    }
  }, []);

  const goToNext = useCallback(() => {
    if (slides.length === 0) return;
    setIsTransitioning(true);
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setIsTransitioning(false);
    }, 400);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    if (slides.length === 0) return;
    setIsTransitioning(true);
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setIsTransitioning(false);
    }, 400);
  }, [slides.length]);

  const goToSlide = (index) => {
    setIsTransitioning(true);
    setImageLoaded(false);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 400);
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && slides.length > 0) {
      const interval = setInterval(goToNext, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, goToNext, slides.length]);

  // Keyboard controls
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

  // Generate floating hearts
  const hearts = [...Array(12)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 8}s`,
    animationDuration: `${12 + Math.random() * 8}s`,
    fontSize: `${16 + Math.random() * 24}px`,
    opacity: 0.15 + Math.random() * 0.15
  }));

  // Empty state - no slides yet
  if (slides.length === 0) {
    return (
      <div className="slideshow-container">
        <div className="hearts-container">
          {hearts.map((heart) => (
            <div
              key={heart.id}
              className="floating-heart"
              style={{
                left: heart.left,
                animationDelay: heart.animationDelay,
                animationDuration: heart.animationDuration,
                fontSize: heart.fontSize,
                opacity: heart.opacity
              }}
            >
              ♥
            </div>
          ))}
        </div>
        <div className="content">
          <div className="empty-state">
            <h2>No slides yet!</h2>
            <p>Add some beautiful photos to get started.</p>
            <Link to="/admin" className="admin-link">
              Go to Admin Panel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="slideshow-container">
      {/* Floating hearts background */}
      <div className="hearts-container">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="floating-heart"
            style={{
              left: heart.left,
              animationDelay: heart.animationDelay,
              animationDuration: heart.animationDuration,
              fontSize: heart.fontSize,
              opacity: heart.opacity
            }}
          >
            ♥
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="content">
        {/* Header */}
        <div className="header">
          <div className="header-decor">✦</div>
          <h1 className="title">Happy Birthday, My Love</h1>
          <div className="header-decor">✦</div>
        </div>

        {/* Slideshow frame */}
        <div className="frame-outer">
          <div className="frame-inner">
            <div className="image-container">
              <img
                src={currentSlide.image}
                alt={currentSlide.caption}
                className={`slide-image ${isTransitioning || !imageLoaded ? 'transitioning' : ''}`}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="image-overlay" />
              <div className="slide-counter">
                {currentIndex + 1} / {slides.length}
              </div>
            </div>
          </div>
        </div>

        {/* Caption area */}
        <div className="caption-container">
          <div className="caption-heart"><HeartIcon /></div>
          <p className={`caption ${isTransitioning ? 'transitioning' : ''}`}>
            {currentSlide.caption}
          </p>
          <div className="caption-heart"><HeartIcon /></div>
        </div>

        {/* Progress dots */}
        <div className="dots-container">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="controls">
          <button onClick={goToPrev} className="nav-button" aria-label="Previous slide">
            <ChevronLeft />
          </button>

          <button onClick={togglePlay} className="play-button" aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span className="play-button-text">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>

          <button onClick={goToNext} className="nav-button" aria-label="Next slide">
            <ChevronRight />
          </button>
        </div>

        {/* Footer message */}
        <div className="footer">
          <p className="footer-text">Made with all my love, just for you ♥</p>
        </div>
      </div>
    </div>
  );
}