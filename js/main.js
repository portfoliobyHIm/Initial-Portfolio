/**
 * ==========================================================================
 * MAIN APPLICATION COORDINATOR
 * ==========================================================================
 * - Preloader Digital Percentage Counter
 * - Navigation & Mobile Drawer
 * - About Me Tabs
 * - Copy-to-Clipboard with Tooltip Feedback
 * - Contact Form Handler & Toast Notification
 * - Intersection Observer Scroll Reveals
 */

(function () {
  'use strict';

  // --- 1. Digital Percentage Preloader Controller (Nitika Portfolio Reference) ---
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    const counterEl = document.getElementById('preloader-counter');
    const progressBar = document.getElementById('preloader-progress-bar');

    if (!preloader || !counterEl) return;

    let count = 0;
    const duration = 1500; // 1.5 seconds loading experience
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth cubic-out easing for realistic loading count
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      count = Math.floor(easedProgress * 100);

      counterEl.textContent = count.toString().padStart(2, '0');
      if (progressBar) {
        progressBar.style.width = `${count}%`;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // Complete loading
        counterEl.textContent = '100';
        if (progressBar) progressBar.style.width = '100%';

        setTimeout(() => {
          preloader.classList.add('loaded');
          document.body.classList.remove('no-scroll');
          // Trigger initial scroll reveals
          initScrollReveals();
        }, 300);
      }
    }

    document.body.classList.add('no-scroll');
    requestAnimationFrame(step);
  }

  // --- 2. Navigation & Header Scroll State ---
  function initNavigation() {
    const header = document.getElementById('site-header');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileDrawer = document.getElementById('mobile-nav-drawer');
    const drawerOverlay = document.getElementById('mobile-drawer-overlay');
    const navLinks = document.querySelectorAll('.nav-item, .mobile-nav-item');

    // Sticky Header on Scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
      updateActiveNavLink();
    }, { passive: true });

    // Mobile Drawer Toggle
    function toggleMobileMenu() {
      mobileDrawer?.classList.toggle('open');
      drawerOverlay?.classList.toggle('open');
      menuToggle?.classList.toggle('active');
    }

    menuToggle?.addEventListener('click', toggleMobileMenu);
    drawerOverlay?.addEventListener('click', toggleMobileMenu);

    // Smooth Scroll & Close Drawer on Link Click
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            if (mobileDrawer?.classList.contains('open')) {
              toggleMobileMenu();
            }
          }
        }
      });
    });

    // ScrollSpy for Active Nav Link
    function updateActiveNavLink() {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 150;

      sections.forEach((section) => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach((l) => {
            l.classList.remove('active');
            if (l.getAttribute('href') === `#${id}`) {
              l.classList.add('active');
            }
          });
        }
      });
    }
  }

  // --- 3. About Me Tabs Controller ---
  function initAboutTabs() {
    const tabBtns = document.querySelectorAll('.about-tab-btn');
    const tabPanels = document.querySelectorAll('.about-tab-panel');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach((b) => b.classList.remove('active'));
        tabPanels.forEach((p) => p.classList.remove('active'));

        btn.classList.add('active');
        const activePanel = document.getElementById(`tab-panel-${targetTab}`);
        if (activePanel) {
          activePanel.classList.add('active');
        }
      });
    });
  }

  // --- 4. Copy-to-Clipboard Email with Interactive Tooltip (Adham Dannaway Style) ---
  function initEmailCopy() {
    const emailCard = document.getElementById('email-copy-card');
    const copyTooltip = document.getElementById('email-copy-tooltip');

    if (!emailCard || !copyTooltip) return;

    emailCard.addEventListener('click', (e) => {
      e.preventDefault();
      const email = emailCard.getAttribute('data-email') || 'hello@yourportfolio.com';

      navigator.clipboard.writeText(email).then(() => {
        copyTooltip.textContent = 'Yay! Email copied to clipboard ✅';
        copyTooltip.classList.add('show');

        setTimeout(() => {
          copyTooltip.classList.remove('show');
          setTimeout(() => {
            copyTooltip.textContent = 'Click to copy email address 📋';
          }, 300);
        }, 2200);
      }).catch(() => {
        // Fallback mailto
        window.location.href = `mailto:${email}`;
      });
    });
  }

  // --- 5. Contact Form Validation & Toast Feedback ---
  function initContactForm() {
    const form = document.getElementById('quick-connect-form');
    const toast = document.getElementById('contact-toast');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // Submit feedback state
      submitBtn.innerHTML = '<span>Sending message...</span>';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Show toast
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => {
            toast.classList.remove('show');
          }, 4000);
        }
      }, 1000);
    });
  }

  // --- 6. Scroll Reveal Observer ---
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      revealElements.forEach((el) => observer.observe(el));
    } else {
      // Fallback for older browsers
      revealElements.forEach((el) => el.classList.add('revealed'));
    }
  }

  // --- 7. Video Lightbox Modal & Local Video Player ---
  function initVideoPlayer() {
    const videoCard = document.getElementById('featured-video-card');
    const videoElement = document.getElementById('featured-video-element');
    const modal = document.getElementById('video-lightbox');
    const modalTitle = document.getElementById('video-modal-title');
    const modalContainer = document.getElementById('video-modal-container');
    const modalClose = document.getElementById('video-modal-close');
    const openBtns = document.querySelectorAll('.open-video-modal-btn');

    // Autoplay and loop all inline loop videos seamlessly with custom speed
    const seamlessVideos = document.querySelectorAll('video[autoplay]');
    seamlessVideos.forEach((video) => {
      const speed = parseFloat(video.getAttribute('data-speed')) || 1.0;
      video.defaultPlaybackRate = speed;
      video.playbackRate = speed;

      video.addEventListener('loadeddata', () => {
        video.playbackRate = speed;
      });

      video.addEventListener('play', () => {
        video.playbackRate = speed;
      });

      video.play().catch(() => {});
      video.addEventListener('ended', () => {
        video.currentTime = 0;
        video.playbackRate = speed;
        video.play().catch(() => {});
      });
    });

    // Hover autoplay for local video card preview
    if (videoCard && videoElement) {
      videoCard.addEventListener('mouseenter', () => {
        videoElement.play().catch(() => {});
      });
      videoCard.addEventListener('mouseleave', () => {
        videoElement.pause();
      });

      // Clicking card opens full modal
      videoCard.addEventListener('click', () => {
        const title = videoCard.getAttribute('data-video-title') || 'Motion Graphics Showreel';
        const src = videoCard.getAttribute('data-video-src') || 'assets/videos/showcase.mp4';
        openModal(src, title);
      });
    }

    // Modal Trigger Buttons
    openBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.getAttribute('data-video-url') || 'assets/videos/showcase.mp4';
        const title = btn.getAttribute('data-title') || 'Video Project Preview';
        const speed = parseFloat(btn.getAttribute('data-speed')) || 1.0;
        openModal(url, title, speed);
      });
    });

    function openModal(src, title, speed = 1.0) {
      if (!modal || !modalContainer) return;
      modalTitle.textContent = title;

      if (src.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
        // Embed High-Res Image Preview
        modalContainer.innerHTML = `
          <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; padding:16px; background:#0b0d14;">
            <img src="${src}" alt="${title}" style="max-width:100%; max-height:100%; object-fit:contain; border-radius:8px; box-shadow:0 10px 40px rgba(0,0,0,0.6);">
          </div>
        `;
      } else if (src.includes('youtube.com') || src.includes('youtu.be')) {
        let videoId = '';
        const ytMatch = src.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
        if (ytMatch && ytMatch[1]) {
          videoId = ytMatch[1];
        } else if (src.includes('watch?v=')) {
          videoId = src.split('watch?v=')[1].split('&')[0];
        } else if (src.includes('youtu.be/')) {
          videoId = src.split('youtu.be/')[1].split('?')[0];
        } else if (src.includes('embed/')) {
          videoId = src.split('embed/')[1].split('?')[0];
        }

        const ytWatchUrl = `https://www.youtube.com/watch?v=${videoId}`;
        modalContainer.innerHTML = `
          <div style="position:relative; width:100%; height:100%; background:#000;">
            <iframe 
              src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowfullscreen 
              style="width:100%; height:100%; border:none;">
            </iframe>
            <div style="position:absolute; bottom:14px; right:16px; z-index:20; background:rgba(15,23,42,0.92); backdrop-filter:blur(8px); padding:6px 14px; border-radius:9999px; border:1px solid rgba(255,255,255,0.18); box-shadow:0 6px 20px rgba(0,0,0,0.4);">
              <a href="${ytWatchUrl}" target="_blank" rel="noopener noreferrer" style="color:#ffffff; font-size:0.8125rem; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:6px; transition:color 0.2s;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff4d4d"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span>Watch on YouTube ↗</span>
              </a>
            </div>
          </div>
        `;
      } else if (src.includes('vimeo.com')) {
        let vimeoId = src.split('vimeo.com/')[1].split('?')[0];
        modalContainer.innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}?autoplay=1" allow="autoplay; fullscreen" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>`;
      } else {
        // Embed HTML5 Video
        modalContainer.innerHTML = `
          <video id="modal-html5-video" controls autoplay style="width:100%; height:100%; object-fit:contain; background:#000;">
            <source src="${src}" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        `;
        const modalVid = document.getElementById('modal-html5-video');
        if (modalVid && (speed !== 1.0 || src.includes('posters_showcase_loop'))) {
          const targetSpeed = speed !== 1.0 ? speed : 0.8;
          modalVid.defaultPlaybackRate = targetSpeed;
          modalVid.playbackRate = targetSpeed;
          modalVid.addEventListener('play', () => { modalVid.playbackRate = targetSpeed; });
        }
      }

      modal.classList.add('open');
      document.body.classList.add('no-scroll');
    }

    function closeModal() {
      if (!modal) return;
      modal.classList.remove('open');
      document.body.classList.remove('no-scroll');
      if (modalContainer) {
        modalContainer.innerHTML = ''; // Stop video playback
      }
    }

    modalClose?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // Initialize all features on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initAboutTabs();
    initEmailCopy();
    initContactForm();
    initVideoPlayer();
  });
})();
