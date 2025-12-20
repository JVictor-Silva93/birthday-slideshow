import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

// ============================================
// ADD YOUR IMAGE FILENAMES HERE
// Place your images in: public/slides/
// ============================================
const imageFiles = [
  "baby_caleb.png",
  "bap_ghibli.png",
  "beach.png",
  "birth.jpeg",
  "boba.png",
  "cats_connection.png",
  "fun_christmas.png",
  "ghibli_gun.png",
  "ghibli_gun2.png",
  "ghibli_gun3.png",
  "grandparents.png",
  "joyride.png",
  "lol.jpeg",
  "nurse1.png",
  "nurse2.png",
  "picanha.png",
  "proposal2.png",
  "rings.png",
  "surprised.png",
  "tacos_premarital.png",
  "ultrasound_pic.png",
  "us_three.png",
  "wedding_meal.png",
  "wedding_and_cat_america.png",
  "weddingpic_ghibli.png",
  "wrestling_party.png",
];

export default function Admin() {
  const [captions, setCaptions] = useState({});
  const [order, setOrder] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editCaption, setEditCaption] = useState('');

  // Load captions and order from localStorage on mount
  useEffect(() => {
    const savedCaptions = localStorage.getItem('birthdayCaptions');
    const savedOrder = localStorage.getItem('birthdayOrder');

    if (savedCaptions) {
      setCaptions(JSON.parse(savedCaptions));
    }

    if (savedOrder) {
      // Use saved order, but add any new files and remove deleted ones
      const parsedOrder = JSON.parse(savedOrder);
      const validOrder = parsedOrder.filter(f => imageFiles.includes(f));
      const newFiles = imageFiles.filter(f => !validOrder.includes(f));
      setOrder([...validOrder, ...newFiles]);
    } else {
      setOrder(imageFiles);
    }

    setIsLoaded(true);
  }, []);

  // Save captions and order to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('birthdayCaptions', JSON.stringify(captions));
      localStorage.setItem('birthdayOrder', JSON.stringify(order));
    }
  }, [captions, order, isLoaded]);

  // Build slides from ordered image files + saved captions
  const slides = order.map((filename, index) => ({
    id: index,
    image: `/slides/${filename}`,
    filename: filename,
    caption: captions[filename] || ''
  }));

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditCaption(slides[index].caption);
  };

  const saveCaption = () => {
    if (editingIndex !== null) {
      const filename = slides[editingIndex].filename;
      setCaptions((prev) => ({
        ...prev,
        [filename]: editCaption
      }));
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
    if (newIndex < 0 || newIndex >= order.length) return;

    const newOrder = [...order];
    [newOrder[index], newOrder[newIndex]] = [newOrder[newIndex], newOrder[index]];
    setOrder(newOrder);
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

        {/* Instructions */}
        <div className="instructions-box">
          <h3>📁 How to add images:</h3>
          <ol>
            <li>Place your images in the <code>public/slides/</code> folder</li>
            <li>Add the filenames to the <code>imageFiles</code> array in <code>Admin.jsx</code> and <code>birthday-slideshow.jsx</code></li>
            <li>Refresh this page and add your captions below</li>
          </ol>
        </div>

        {/* Slides List */}
        {slides.length > 0 ? (
          <>
            <div className="slides-header">
              <h2 className="slides-title">{slides.length} Slide{slides.length !== 1 ? 's' : ''}</h2>
            </div>

            <div className="slides-list">
              {slides.map((slide, index) => (
                <div key={slide.filename} className="slide-card">
                  <div className="slide-number">{index + 1}</div>

                  <div className="slide-image-wrapper">
                    <img src={slide.image} alt={slide.caption || slide.filename} className="slide-thumbnail" />
                  </div>

                  <div className="slide-details">
                    <div className="slide-filename">{slide.filename}</div>
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
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-slides">
            <p>No images found. Add some filenames to the <code>imageFiles</code> array in Admin.jsx!</p>
          </div>
        )}

        {/* Footer */}
        <div className="admin-footer">
          <p>💡 Tip: Captions and order are saved in your browser. Images are loaded from your public/slides/ folder.</p>
        </div>
      </div>
    </div>
  );
}