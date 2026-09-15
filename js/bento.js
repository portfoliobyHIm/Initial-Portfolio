/**
 * ==========================================================================
 * BENTO GRID 3D TILT & INTERACTIVE COMPONENT CONTROLLER
 * ==========================================================================
 */

(function () {
  'use strict';

  function initBentoGrid() {
    const cards = document.querySelectorAll('.bento-card');

    cards.forEach((card) => {
      // Create and append dynamic glow overlay if not present
      if (!card.querySelector('.bento-glow-effect')) {
        const glow = document.createElement('div');
        glow.className = 'bento-glow-effect';
        card.appendChild(glow);
      }

      // 3D Tilt on Mouse Move
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within element.
        const y = e.clientY - rect.top;  // y position within element.

        // Set CSS custom properties for radial glow
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Subtle 3D tilt calculation
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4; // Max -4deg to +4deg
        const rotateY = ((x - centerX) / centerX) * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });

    // --- Interactive UI Sandbox Controller inside Bento Card 2 ---
    const sandboxPreview = document.getElementById('sandbox-preview');
    const toggleButtons = document.querySelectorAll('.sandbox-btn-toggle');
    const copyCssBtn = document.getElementById('sandbox-copy-css');

    const themes = {
      cyan: {
        bg: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
        shadow: '0 12px 28px rgba(6, 182, 212, 0.4)',
        css: 'background: linear-gradient(135deg, #06b6d4, #8b5cf6);\nbox-shadow: 0 12px 28px rgba(6, 182, 212, 0.4);'
      },
      glass: {
        bg: 'rgba(255, 255, 255, 0.1)',
        shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(12px)',
        css: 'background: rgba(255, 255, 255, 0.1);\nbackdrop-filter: blur(12px);\nborder: 1px solid rgba(255, 255, 255, 0.18);'
      },
      sunset: {
        bg: 'linear-gradient(135deg, #ff5e62, #ff9966)',
        shadow: '0 12px 28px rgba(255, 94, 98, 0.4)',
        css: 'background: linear-gradient(135deg, #ff5e62, #ff9966);\nbox-shadow: 0 12px 28px rgba(255, 94, 98, 0.4);'
      }
    };

    let currentThemeKey = 'cyan';

    if (sandboxPreview && toggleButtons.length > 0) {
      toggleButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const themeKey = btn.getAttribute('data-theme');
          if (!themeKey || !themes[themeKey]) return;

          currentThemeKey = themeKey;
          toggleButtons.forEach((b) => b.classList.remove('active'));
          btn.classList.add('active');

          const t = themes[themeKey];
          sandboxPreview.style.background = t.bg;
          sandboxPreview.style.boxShadow = t.shadow || 'none';
          sandboxPreview.style.border = t.border || 'none';
          sandboxPreview.style.backdropFilter = t.backdropFilter || 'none';
          sandboxPreview.style.webkitBackdropFilter = t.backdropFilter || 'none';
        });
      });
    }

    if (copyCssBtn) {
      copyCssBtn.addEventListener('click', () => {
        const cssSnippet = themes[currentThemeKey]?.css || '';
        navigator.clipboard.writeText(cssSnippet).then(() => {
          const originalText = copyCssBtn.textContent;
          copyCssBtn.textContent = 'Copied! ✨';
          copyCssBtn.classList.add('active');
          setTimeout(() => {
            copyCssBtn.textContent = originalText;
            copyCssBtn.classList.remove('active');
          }, 1800);
        });
      });
    }

    // ==========================================================================
    // VIDEO LIGHTBOX MODAL CONTROLLER (FIXED FOR MP4 & ARIA CONFLICTS)
    // ==========================================================================
    const modal = document.getElementById('video-lightbox');
    const container = document.getElementById('video-modal-container');
    const titleEl = document.getElementById('video-modal-title');
    const closeBtn = document.getElementById('video-modal-close');

    function openVideoModal(videoUrl, title) {
      if (!modal || !container) return;

      if (titleEl && title) {
        titleEl.textContent = title;
      }

      container.innerHTML = '';

      // Check for YouTube URLs
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        let embedUrl = videoUrl;
        if (videoUrl.includes('watch?v=')) {
          const videoId = videoUrl.split('watch?v=')[1].split('&')[0];
          embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        } else if (videoUrl.includes('youtu.be/')) {
          const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
          embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
        }
        container.innerHTML = `<iframe src="${embedUrl}" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;height:100%;display:block;border:none;"></iframe>`;
      } 
      // Direct Local / MP4 Video Handling
      else {
        const video = document.createElement('video');
        video.id = 'modal-html5-video';
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.display = 'block';
        video.style.objectFit = 'contain';

        const source = document.createElement('source');
        // Clean URL to handle raw spaces or encoded %20
        source.src = encodeURI(decodeURI(videoUrl.trim()));
        source.type = 'video/mp4';

        video.appendChild(source);
        container.appendChild(video);

        video.load();
        video.play().catch((err) => {
          console.warn('Playback error or user gesture required:', err);
        });
      }

      // Show modal & resolve aria-hidden accessibility collision
      modal.classList.add('open');
      modal.removeAttribute('aria-hidden');
      document.body.classList.add('no-scroll');
    }

    function closeVideoModal() {
      if (!modal) return;

      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll');

      if (container) {
        container.innerHTML = '';
      }
    }

    // Global listener for all modal trigger buttons and elements
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.open-video-modal-btn');
      if (trigger) {
        e.preventDefault();
        const videoUrl = trigger.getAttribute('data-video-url');
        const videoTitle = trigger.getAttribute('data-title') || 'Project Video Preview';
        if (videoUrl) {
          openVideoModal(videoUrl, videoTitle);
        }
        return;
      }

      // Close button or outside backdrop click
      if (e.target.closest('#video-modal-close') || e.target === modal) {
        e.preventDefault();
        closeVideoModal();
      }
    });

    // Escape key listener to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeVideoModal();
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBentoGrid);
  } else {
    initBentoGrid();
  }
})();
