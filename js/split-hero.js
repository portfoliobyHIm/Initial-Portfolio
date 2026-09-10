/**
 * ==========================================================================
 * HIGH-PERFORMANCE SQUARE CLIP-PATH HOVER REVEAL CONTROLLER (220PX)
 * ==========================================================================
 * Square clip-path reveal with smooth cursor lerp momentum.
 * Desktop mouse-only: touch listeners removed to allow normal mobile scrolling.
 */

(function () {
  'use strict';

  function initSquareClipPathHero() {
    // Disable completely on mobile screens under 768px
    if (window.innerWidth <= 768) {
      return;
    }

    const stage = document.getElementById('hero-portrait-stage');
    const revealLayer = document.getElementById('hero-reveal-layer');
    const reticle = document.getElementById('hero-reticle');
    const glassCard = document.getElementById('hero-glass-card');

    if (stage && revealLayer && reticle) {
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;
      let isHovered = false;
      let targetSize = 0;
      let currentSize = 0;

      // Set initial center coordinates
      const initialRect = stage.getBoundingClientRect();
      targetX = initialRect.width / 2;
      targetY = initialRect.height / 2;
      currentX = targetX;
      currentY = targetY;

      // Mouse Enter
      stage.addEventListener('mouseenter', (e) => {
        isHovered = true;
        targetSize = 220;
        reticle.classList.add('is-active');
        const rect = stage.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      });

      // Mouse Leave
      stage.addEventListener('mouseleave', () => {
        isHovered = false;
        targetSize = 0;
        reticle.classList.remove('is-active');
      });

      // Mouse Move
      stage.addEventListener('mousemove', (e) => {
        const rect = stage.getBoundingClientRect();
        targetX = e.clientX - rect.left;
        targetY = e.clientY - rect.top;
      });

      function animate() {
        // Stop animating if screen was resized to mobile
        if (window.innerWidth <= 768) {
          return;
        }

        // Lerp smooth movement physics
        currentX += (targetX - currentX) * 0.14;
        currentY += (targetY - currentY) * 0.14;
        currentSize += (targetSize - currentSize) * 0.12;

        // Calculate square box boundaries (half-size = 110px when full)
        const half = Math.max(0, currentSize) / 2;
        const sqLeft = currentX - half;
        const sqRight = currentX + half;
        const sqTop = currentY - half;
        const sqBottom = currentY + half;

        // Apply coordinates to the square clip-path
        revealLayer.style.setProperty('--sq-left', `${sqLeft.toFixed(1)}px`);
        revealLayer.style.setProperty('--sq-right', `${sqRight.toFixed(1)}px`);
        revealLayer.style.setProperty('--sq-top', `${sqTop.toFixed(1)}px`);
        revealLayer.style.setProperty('--sq-bottom', `${sqBottom.toFixed(1)}px`);

        // Track reticle box position
        reticle.style.left = `${currentX.toFixed(1)}px`;
        reticle.style.top = `${currentY.toFixed(1)}px`;

        // Parallax Float for Hero Glass Overlay Card
        if (glassCard) {
          const rect = stage.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            const offsetPxX = ((currentX - rect.width / 2) / (rect.width / 2)) * 10;
            const offsetPxY = ((currentY - rect.height / 2) / (rect.height / 2)) * 8;
            glassCard.style.setProperty('--parallax-x', `${offsetPxX.toFixed(2)}px`);
            glassCard.style.setProperty('--parallax-y', `${offsetPxY.toFixed(2)}px`);
          }
        }

        requestAnimationFrame(animate);
      }

      animate();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSquareClipPathHero);
  } else {
    initSquareClipPathHero();
  }
})();
