/**
 * EPISCOPAL CHURCH OF THE HOLY APOSTLES — SCRIPT
 * Clean, Soft & Gentle Experience • Slider, Tabs, Ministry Filters & Offering
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. HERO SLIDER CONTROLLER
     ========================================================================== */
  const slides = document.querySelectorAll('.slide-item');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  const dotBtns = document.querySelectorAll('.dot-btn');
  const progressBar = document.getElementById('sliderProgress');
  const sliderViewport = document.getElementById('sliderViewport');

  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideDuration = 7000; // 7 seconds per slide
  let progressInterval = null;
  let progressStartTime = 0;
  let isPaused = false;

  function showSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;

    // Update slides
    slides.forEach((slide, idx) => {
      if (idx === currentSlide) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Update floating dots
    dotBtns.forEach((dot, idx) => {
      if (idx === currentSlide) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    resetProgress();
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startProgress() {
    progressStartTime = Date.now();
    if (progressInterval) clearInterval(progressInterval);

    progressInterval = setInterval(() => {
      if (!isPaused) {
        const elapsed = Date.now() - progressStartTime;
        const percent = Math.min((elapsed / slideDuration) * 100, 100);
        if (progressBar) progressBar.style.width = percent + '%';

        if (elapsed >= slideDuration) {
          nextSlide();
        }
      } else {
        progressStartTime += 50;
      }
    }, 50);
  }

  function resetProgress() {
    if (progressBar) progressBar.style.width = '0%';
    startProgress();
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
    });
  }

  dotBtns.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
    });
  });

  // Pause on hover
  if (sliderViewport) {
    sliderViewport.addEventListener('mouseenter', () => { isPaused = true; });
    sliderViewport.addEventListener('mouseleave', () => { isPaused = false; });
  }

  // Touch Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  if (sliderViewport) {
    sliderViewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderViewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      nextSlide();
    } else if (touchEndX > touchStartX + swipeThreshold) {
      prevSlide();
    }
  }

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  // Initialize Slider
  showSlide(0);

  /* ==========================================================================
     2. STICKY NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHT
     ========================================================================== */
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (navbar) {
      if (scrollPos > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // ScrollSpy for Nav Links
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { passive: true });

  /* ==========================================================================
     3. INTERSECTION OBSERVER FOR SCROLL REVEAL ANIMATIONS
     ========================================================================== */
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-delay') || 0;

          setTimeout(() => {
            el.classList.add('revealed');
          }, delay);

          observer.unobserve(el);
        }
      });
    }, {
      root: null,
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  /* ==========================================================================
     4. WORSHIP SCHEDULE TAB SWITCHER
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.sched-tab-btn');
  const panels = document.querySelectorAll('.schedule-panel');

  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const targetId = 'tab-' + btn.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     5. MINISTRY CARDS CATEGORY FILTER
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const ministryCards = document.querySelectorAll('.ministry-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      ministryCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.97)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     6. GIVING & OFFERING INTERACTIVE CALCULATOR
     ========================================================================== */
  const fundLabels = document.querySelectorAll('.fund-label');
  const amountBtns = document.querySelectorAll('.amount-btn');

  fundLabels.forEach((label) => {
    label.addEventListener('click', () => {
      fundLabels.forEach((l) => l.classList.remove('active'));
      label.classList.add('active');
    });
  });

  amountBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      amountBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* ==========================================================================
     7. MOBILE DRAWER NAVIGATION
     ========================================================================== */
  const menuToggle = document.getElementById('menuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerClose = document.getElementById('drawerClose');
  const mobileLinks = document.querySelectorAll('.m-link');

  if (menuToggle && mobileDrawer) {
    menuToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  mobileLinks.forEach((link) => link.addEventListener('click', closeDrawer));

  /* ==========================================================================
     8. CONTACT & PRAYER REQUEST FORM
     ========================================================================== */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');

  if (contactForm && formStatus) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message with Aloha...';
      }

      setTimeout(() => {
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Send Message to Holy Apostles</span> <i class="fa-solid fa-paper-plane"></i>';
        }

        formStatus.className = 'form-status success';
        formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Mahalo! Your message and prayer request have been received. We will be in touch with you shortly.';

        setTimeout(() => {
          formStatus.style.display = 'none';
        }, 7000);
      }, 1000);
    });
  }

  /* ==========================================================================
     9. UPDATE CURRENT YEAR IN FOOTER
     ========================================================================== */
  const yearSpan = document.getElementById('currentYear');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

});
