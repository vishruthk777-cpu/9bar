// Intro Controller: transition body state after logo reveal completes
document.addEventListener('DOMContentLoaded', () => {
  // Intro Completion Timer (400ms bg fade + 1100ms logo reveal + 500ms pause = 2000ms)
  setTimeout(() => {
    document.body.classList.remove('intro-active');
    document.body.classList.add('intro-finished');
  }, 2000);
  // ==========================================================================
  // NAVIGATION & SCROLL EVENT
  // ==========================================================================
  const header = document.querySelector('header');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky Header on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      // Prevent body scroll when menu is active
      document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  // Close Mobile Menu when link clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navToggle && navToggle.classList.contains('active')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close Mobile Menu when clicking outside of it
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // ==========================================================================
  // SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-scale');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once revealed
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================================================
  // SIGNATURE COFFEE TABS
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.sig-panel');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update active tab button
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Update active panel with transition
      panels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.getAttribute('id') === targetTab) {
          // Add timeout to let CSS display property catch up before fading in
          setTimeout(() => {
            panel.classList.add('active');
          }, 50);
        }
      });
    });
  });

  // ==========================================================================
  // EDITORIAL GALLERY FILTERS
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      // Update active filter button
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter gallery items
      galleryItems.forEach(item => {
        const itemCategories = item.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || itemCategories.includes(filterValue)) {
          item.style.display = '';
          // Trigger entry transitions
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          // Hide after transition completes
          setTimeout(() => {
            item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // ==========================================================================
  // TESTIMONIALS SLIDER
  // ==========================================================================
  const sliderTrack = document.querySelector('.test-track');
  const slides = document.querySelectorAll('.test-slide');
  const prevBtn = document.querySelector('.test-prev');
  const nextBtn = document.querySelector('.test-next');
  const dotContainer = document.querySelector('.test-dots');
  
  let currentSlide = 0;
  const slideCount = slides.length;

  if (sliderTrack && slideCount > 0) {
    // Generate navigation dots
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('test-dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.test-dot');

    const updateSlider = () => {
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
      });
    };

    const goToSlide = (index) => {
      currentSlide = index;
      updateSlider();
    };

    const nextSlide = () => {
      currentSlide = (currentSlide + 1) % slideCount;
      updateSlider();
    };

    const prevSlide = () => {
      currentSlide = (currentSlide - 1 + slideCount) % slideCount;
      updateSlider();
    };

    // Auto-advance slides every 6 seconds
    let autoPlayInterval = setInterval(nextSlide, 6000);

    const resetAutoplay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(nextSlide, 6000);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
      });
    }
  }

  // ==========================================================================
  // ==========================================================================
  // CUSTOM IN-PAGE RESERVATION SYSTEM
  // ==========================================================================
  const openReservationBtns = document.querySelectorAll('.open-reservation');
  const reservationSection = document.getElementById('reservation');
  const reserveForm = document.querySelector('.reserve-form');
  const successState = document.querySelector('.modal-success-state');
  const doneBtn = document.querySelector('#reservation-success-state .modal-close');

  // Smooth scroll to reservation section when clicking "Reserve a Table"
  openReservationBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (reservationSection) {
        reservationSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Handle Form Submission
  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Open the Swiggy Dineout reservation page in a new tab
      window.open("https://www.swiggy.com/restaurants/hyderabad/nanakramguda/9bar-speciality-coffee-1370029/dineout", "_blank");
      
      const submitBtn = reserveForm.querySelector('.form-submit-btn');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'REDIRECTING TO SWIGGY...';
      submitBtn.style.pointerEvents = 'none';

      setTimeout(() => {
        submitBtn.textContent = originalBtnText;
        submitBtn.style.pointerEvents = 'all';
        
        // Switch views inline
        reserveForm.style.display = 'none';
        if (successState) {
          successState.style.display = 'flex';
          
          // Inject form values to personalize success message
          const nameInput = document.querySelector('#res-name').value;

          const summaryElem = document.querySelector('#reservation-success-state .success-message');
          if (summaryElem) {
            summaryElem.innerHTML = `Thank you, <strong>${nameInput}</strong>. We are directing you to Swiggy Dineout to finalize your reservation. If the page did not load automatically, please <a href="https://www.swiggy.com/restaurants/hyderabad/nanakramguda/9bar-speciality-coffee-1370029/dineout" target="_blank" rel="noopener" style="color: var(--champagne-gold); text-decoration: underline;">click here to continue</a>.`;
          }
        }
      }, 1000);
    });
  }

  // Done button reset behavior
  if (doneBtn && reserveForm && successState) {
    doneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      successState.style.display = 'none';
      reserveForm.style.display = 'grid';
      reserveForm.reset();
    });
  }
});
