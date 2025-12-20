import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

export default function Admin() {
  const [slides, setSlides] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const fileInputRef = useRef(null);

  // Load slides from localStorage on mount
  useEffect(() => {
    const savedSlides = localStorage.getItem('birthdaySlides');
    if (savedSlides) {
      setSlides(JSON.parse(savedSlides));
    }
    setIsLoaded(true);
  }, []);

  // Save slides to localStorage whenever they change (only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('birthdaySlides', JSON.stringify(slides));
    }
  }, [slides, isLoaded]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newSlide = {
          id: Date.now() + Math.random(),
          image: event.target.result, // base64 string
          caption: ''
        };
        setSlides((prev) => [...prev, newSlide]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be uploaded again if needed
    e.target.value = '';
  };

  const deleteSlide = (index) => {
    if (window.confirm('Are you sure you want to delete this slide?')) {
      setSlides((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditCaption(slides[index].caption);
  };

  const saveCaption = () => {
    if (editingIndex !== null) {
      setSlides((prev) =>
        prev.map((slide, i) =>
          i === editingIndex ? { ...slide, caption: editCaption } : slide
        )
      );
      setEditingIndex(null);
      setEditCaption('');
    }
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditCaption('');
  };

  const moveSlide = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const newSlides = [...slides];
    [newSlides[index], newSlides[newIndex]] = [newSlides[newIndex], newSlides[index]];
    setSlides(newSlides);
  };

  const clearAllSlides = () => {
    if (window.confirm('Are you sure you want to delete ALL slides? This cannot be undone.')) {
      setSlides([]);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-content">
        {/* Header */}
        <div className="admin-header">
          <h1 className="admin-title">Slideshow Admin</h1>
          <Link to="/" className="preview-button">
            Preview Slideshow →
          </Link>
        </div>

        {/* Upload Section */}
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="file-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="upload-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            Upload Photos
          </label>
          <p className="upload-hint">Click or drag photos to upload. You can select multiple at once.</p>
        </div>

        {/* Slides List */}
        {slides.length > 0 ? (
          <>
            <div className="slides-header">
              <h2 className="slides-title">{slides.length} Slide{slides.length !== 1 ? 's' : ''}</h2>
              <button onClick={clearAllSlides} className="clear-all-button">
                Clear All
              </button>
            </div>

            <div className="slides-list">
              {slides.map((slide, index) => (
                <div key={slide.id} className="slide-card">
                  <div className="slide-number">{index + 1}</div>

                  <div className="slide-image-wrapper">
                    <img src={slide.image} alt={slide.caption} className="slide-thumbnail" />
                  </div>

                  <div className="slide-details">
                    {editingIndex === index ? (
                      <div className="caption-edit">
                        <textarea
                          value={editCaption}
                          onChange={(e) => setEditCaption(e.target.value)}
                          className="caption-input"
                          placeholder="Enter a caption..."
                          autoFocus
                        />
                        <div className="caption-edit-buttons">
                          <button onClick={saveCaption} className="save-button">Save</button>
                          <button onClick={cancelEditing} className="cancel-button">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <p className="slide-caption" onClick={() => startEditing(index)}>
                        {slide.caption || <span className="caption-placeholder">Add a caption...</span>}
                        <span className="edit-hint">Click to edit</span>
                      </p>
                    )}
                  </div>

                  <div className="slide-actions">
                    <button
                      onClick={() => moveSlide(index, -1)}
                      disabled={index === 0}
                      className="move-button"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSlide(index, 1)}
                      disabled={index === slides.length - 1}
                      className="move-button"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => deleteSlide(index)}
                      className="delete-button"
                      title="Delete slide"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-slides">
            <p>No slides yet. Upload some photos to get started!</p>
          </div>
        )}

        {/* Footer */}
        <div className="admin-footer">
          <p>💡 Tip: Images are stored in your browser. They'll persist until you clear your browser data.</p>
        </div>
      </div>
    </div>
  );
}