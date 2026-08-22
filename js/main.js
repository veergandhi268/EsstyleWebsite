/**
 * ESSTYLE - "Se Kharido, Style Se Paheno"
 * Premium Client-Side Interactivity, Responsive Handlers & Motion Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initCategoryTabs();
  initForms();
  initScrollSpy();
  initScrollAnimations();
  initOrientationHandler();
});

/* ==========================================================================
   1. Sticky Header & Scroll Blur
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   2. Mobile Menu & Backdrop Blur
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');
  let backdrop = document.querySelector('.nav-backdrop');

  // Create backdrop element if not in DOM
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  if (!toggleBtn || !navMenu) return;

  function openMenu() {
    navMenu.classList.add('mobile-open');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-xmark');
    }
  }

  function closeMenu() {
    navMenu.classList.remove('mobile-open');
    backdrop.classList.remove('active');
    document.body.style.overflow = '';
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navMenu.classList.contains('mobile-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Tap backdrop to close
  backdrop.addEventListener('click', closeMenu);

  // Close when clicking simple nav link (not dropdown toggle)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const parentItem = link.closest('.nav-item');
      const hasDropdown = parentItem && parentItem.querySelector('.dropdown-menu');

      // If mobile view and item has dropdown, toggle dropdown on click
      if (window.innerWidth <= 768 && hasDropdown) {
        e.preventDefault();
        parentItem.classList.toggle('dropdown-active');
        const chevron = link.querySelector('.fa-chevron-down');
        if (chevron) {
          chevron.style.transform = parentItem.classList.contains('dropdown-active') ? 'rotate(180deg)' : 'rotate(0)';
          chevron.style.transition = 'transform 0.25s ease';
        }
      } else {
        closeMenu();
      }
    });
  });

  // Close when clicking dropdown items
  const dropdownLinks = document.querySelectorAll('.dropdown-item a');
  dropdownLinks.forEach(dl => {
    dl.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   3. Uniform Category Filter Tabs with Smooth Transitions
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

      catCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translate3d(0, 0, 0)';
          }, 30 + (index * 40));
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translate3d(0, 16px, 0)';
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
      }, 700);
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

  // Force reflow
  void toast.offsetWidth;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4200);
}

/* ==========================================================================
   5. ScrollSpy (Active Section Highlighting)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   6. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  // Elements to auto-reveal on scroll
  const targets = document.querySelectorAll(
    '.category-card, .branding-card, .process-card, .testimonial-card, .fabric-feat-card, .ribbon-item, .section-header, .contact-section-wrap'
  );

  if (!targets.length) return;

  // Add base reveal class
  targets.forEach((el, idx) => {
    el.classList.add('reveal-item');
    const staggerClass = `reveal-stagger-${(idx % 4) + 1}`;
    el.classList.add(staggerClass);
  });

  if (!('IntersectionObserver' in window)) {
    targets.forEach(el => el.classList.add('revealed'));
    return;
  }

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   7. Device Orientation & Resize Handlers
   ========================================================================== */
function initOrientationHandler() {
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      const navMenu = document.querySelector('.nav-menu');
      const backdrop = document.querySelector('.nav-backdrop');
      const toggleBtn = document.querySelector('.mobile-toggle');

      if (navMenu) navMenu.classList.remove('mobile-open');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';

      if (toggleBtn) {
        const icon = toggleBtn.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      }
    }
  }, { passive: true });
}
