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
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBentoGrid);
  } else {
    initBentoGrid();
  }
})();
