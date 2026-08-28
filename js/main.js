/**
 * ESSTYLE - "Se Kharido, Style Se Paheno"
 * Clean Client-Side JavaScript Logic & Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initCategoryTabs();
  initForms();
  initFaqAccordion();
  initVideoTestimonials();
  initTouchFeedback();
});

/* ==========================================================================
   1. Sticky Header & Scroll Effects
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-open');
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      if (navMenu.classList.contains('mobile-open')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    }
  });

  // Close when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('mobile-open');
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });
  });
}

/* ==========================================================================
   3. Uniform Category Filter Tabs
   ========================================================================== */
function initCategoryTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const catCards = document.querySelectorAll('.category-card');

  if (!tabBtns.length || !catCards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      catCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   4. Contact Form Submissions & Toast Alerts
   ========================================================================== */
function initForms() {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Send Inquiry';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        form.reset();
        showToast('Thank you! Your inquiry has been received. Our ESSTYLE Uniform Specialist will connect with you within 2 hours.');
      }, 800);
    });
  });
}

function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${message}</span>`;
    document.body.appendChild(toast);
  } else {
    toast.querySelector('span').textContent = message;
  }

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* ==========================================================================
   5. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close other open items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove('active');
      });

      if (!isOpen) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

/* ==========================================================================
   6. Video Testimonials — Native HTML5 Video (Pause Others on Play)
   ========================================================================== */
function initVideoTestimonials() {
  const videos = Array.from(document.querySelectorAll('video'));
  if (!videos.length) return;

  videos.forEach(video => {
    const pauseOthers = () => {
      videos.forEach(otherVideo => {
        if (otherVideo !== video) {
          otherVideo.pause();
        }
      });
    };

    video.addEventListener('play', pauseOthers);
    video.addEventListener('playing', pauseOthers);
  });
}

/* ==========================================================================
   7. Mobile Touch & Click Ripple / Scale Feedback
   ========================================================================== */
function initTouchFeedback() {
  // Activate iOS WebKit active touch response
  document.body.addEventListener('touchstart', () => {}, { passive: true });

  const interactiveSelectors = [
    '.btn',
    '.tab-btn',
    '.category-card',
    '.branding-card',
    '.process-card',
    '.fabric-feat-card',
    '.faq-header',
    '.nav-link',
    '.cat-cta-link',
    '.social-link',
    '.client-logo-item'
  ].join(', ');

  const elements = document.querySelectorAll(interactiveSelectors);

  elements.forEach(el => {
    if (!el.classList.contains('ripple-container')) {
      el.classList.add('ripple-container');
    }

    const onPointerDown = (e) => {
      el.classList.add('touch-active');

      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'click-ripple';

      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;

      const x = (e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.left + rect.width / 2)) - rect.left - size / 2;
      const y = (e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.top + rect.height / 2)) - rect.top - size / 2;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      el.appendChild(ripple);

      setTimeout(() => {
        if (ripple.parentNode) {
          ripple.parentNode.removeChild(ripple);
        }
      }, 450);
    };

    const onPointerUp = () => {
      setTimeout(() => {
        el.classList.remove('touch-active');
      }, 150);
    };

    el.addEventListener('pointerdown', onPointerDown, { passive: true });
    el.addEventListener('pointerup', onPointerUp, { passive: true });
    el.addEventListener('pointercancel', onPointerUp, { passive: true });
    el.addEventListener('pointerleave', onPointerUp, { passive: true });
  });
}
