/**
 * KALPATARU PARKCITY (ESTELLA) - LUXURY TOWNSHIP LANDING PAGE
 * Optimized for High-Converting Google Ads & Meta Campaigns
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initMobileMenu();
  initBrochureModal();
  initFloorPlanTabs();
  initCountdownTimer();
  initSocialProofToast();
  initConnectivityAccordion();
});

/* ==========================================================================
   1. Scroll Reveal Animations (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
  const revealItems = document.querySelectorAll('.reveal-item');
  if (!('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealItems.forEach(item => observer.observe(item));
}

/* ==========================================================================
   2. Brochure Download & Lead Capture Modal System
   ========================================================================== */
function initBrochureModal() {
  const modal = document.getElementById('brochureModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const modalForm = document.getElementById('modalLeadForm');
  const heroForm = document.getElementById('heroLeadForm');
  const successState = document.getElementById('modalSuccessState');
  const modalFormContainer = document.getElementById('modalFormContainer');
  const modalTitle = document.getElementById('modalDynamicTitle');
  const modalSubtitle = document.getElementById('modalDynamicSubtitle');
  const successCloseBtn = document.getElementById('successCloseBtn');

  if (!modal) return;

  // Open modal triggers
  const triggerButtons = document.querySelectorAll('[data-open-modal]');
  triggerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      clearTimeout(autoTimer);
      try {
        sessionStorage.setItem('kalpataru_auto_modal_seen', 'true');
      } catch (err) {}
      const context = btn.getAttribute('data-context') || 'brochure';
      
      // Customize modal text based on button clicked
      if (context === 'pricing') {
        modalTitle.textContent = 'Unlock Exclusive Price & Cost Sheet';
        modalSubtitle.textContent = 'Enter your details to receive unit-wise all-inclusive pricing & payment plans.';
      } else if (context === 'floorplan') {
        modalTitle.textContent = 'Request Official 2D & 3D Floor Plans';
        modalSubtitle.textContent = 'Get detailed carpet area, architectural blueprints & layout PDFs.';
      } else if (context === 'sitevisit') {
        modalTitle.textContent = 'Schedule a VIP Private Site Visit';
        modalSubtitle.textContent = 'Complimentary luxury cab pick & drop service available.';
      } else {
        modalTitle.textContent = 'Enquire for Kalpataru Parkcity Details';
        modalSubtitle.textContent = 'Get complete floor layouts, pricing breakdown & site visit appointments.';
      }

      openModal();
    });
  });

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modalFormContainer.style.display = 'block';
    successState.classList.remove('active');
    modalForm.reset();
  }

  function closeModal() {
    clearTimeout(autoTimer);
    try {
      sessionStorage.setItem('kalpataru_auto_modal_seen', 'true');
    } catch (err) {}
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', closeModal);
  }

  // Auto-Popup System: Trigger after 5.5s OR when user scrolls to Amenities section
  let autoModalFired = false;
  try {
    if (sessionStorage.getItem('kalpataru_auto_modal_seen')) {
      autoModalFired = true;
    }
  } catch (err) {}

  function triggerAutoModal() {
    if (autoModalFired) return;
    if (modal.classList.contains('active')) return;

    autoModalFired = true;
    try {
      sessionStorage.setItem('kalpataru_auto_modal_seen', 'true');
    } catch (err) {}

    modalTitle.textContent = 'Enquire for Kalpataru Parkcity Details';
    modalSubtitle.textContent = 'Get instant access to complete floor layouts, verified cost breakdown & payment plans.';
    openModal();
  }

  // 1. Timer trigger: 5.5 seconds for first-time visitors
  const autoTimer = setTimeout(() => {
    triggerAutoModal();
  }, 5500);

  // 2. Scroll trigger: When reaching the Amenities Section
  const amenitiesSec = document.getElementById('amenities-section');
  if (amenitiesSec && 'IntersectionObserver' in window) {
    const amenitiesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          clearTimeout(autoTimer);
          triggerAutoModal();
          amenitiesObserver.disconnect();
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -30px 0px'
    });
    amenitiesObserver.observe(amenitiesSec);
  }

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission (Modal Form)
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormLead(modalForm, true);
    });
  }

  // Handle Hero Form Submission
  if (heroForm) {
    heroForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormLead(heroForm, false);
    });
  }

  function handleFormLead(formEl, isInsideModal) {
    const submitBtn = formEl.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" style="animation: spin 1s linear infinite; width:18px; height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Processing Your Request...
    `;

    setTimeout(() => {
      try {
        if (typeof fbq === 'function') {
          fbq('track', 'Lead', {
            content_name: 'Kalpataru Parkcity Residence Inquiry',
            status: 'submitted'
          });
        }
        if (typeof gtag === 'function') {
          gtag('event', 'generate_lead', {
            event_category: 'Lead',
            event_label: isInsideModal ? 'Modal Form' : 'Hero Form'
          });
        }
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'lead_form_submitted',
            form_type: isInsideModal ? 'modal' : 'hero'
          });
        }
      } catch (err) {
        console.warn('Analytics tracking error:', err);
      }

      if (isInsideModal) {
        modalFormContainer.style.display = 'none';
        successState.classList.add('active');
      } else {
        modalTitle.textContent = 'Request Received Successfully!';
        modalSubtitle.textContent = 'Our relationship advisor will connect with you on WhatsApp shortly.';
        modalFormContainer.style.display = 'none';
        successState.classList.add('active');
        openModal();
      }
    }, 900);
  }
}

/* ==========================================================================
   4. Floor Plan Interactive Tabs
   ========================================================================== */
function initFloorPlanTabs() {
  const tabs = document.querySelectorAll('.floor-plan-tabs .tab-btn');
  const titleEl = document.getElementById('planUnitTitle');
  const carpetEl = document.getElementById('planCarpetArea');
  const superEl = document.getElementById('planSuperArea');
  const balconiesEl = document.getElementById('planBalconies');
  const facingEl = document.getElementById('planFacing');
  const planImg = document.querySelector('.floor-plan-img');

  if (!tabs.length || !titleEl) return;

  const floorPlanData = {
    'township-master': {
      title: 'Estella at Kalpataru Parkcity - 100+ Acre Master Layout',
      carpet: '100+ Acres Integrated Township',
      super: '20+ Acre Grand Central Park & 3 Acre Lake',
      balconies: '70% Open Space & 4,500+ Green Trees',
      facing: 'Designed by 6 World-Class Master Architects',
      imgSrc: 'images/township-map.webp'
    },
    'tower-b-plan': {
      title: 'Estella Tower Typical Floor Plan',
      carpet: 'Optimized 4-to-Core & 6-to-Core Layouts',
      super: 'Double-Height Grand Entrance Lobby',
      balconies: 'High-Speed Destination Elevators',
      facing: 'Vastu-Compliant Cross-Ventilated Units',
      imgSrc: 'images/estella-floor-plan-1.webp'
    },
    '2bhk-unit': {
      title: '2 BHK Premium Residence with Sundeck',
      carpet: 'Spacious Living & Dining Area',
      super: 'Private Balcony with Grand Central Park View',
      balconies: 'Master Bedroom with Panoramic Glazing',
      facing: 'East-West Vastu Compliant Facing',
      imgSrc: 'images/estella-unit-plan-1.webp'
    },
    '3bhk-unit': {
      title: '3 BHK Palatial Residence with Lake Views',
      carpet: 'Expansive 3 Bed Luxury Suite',
      super: 'Wrap-Around Sundeck & Island Kitchen Provision',
      balconies: 'Unobstructed 3-Acre Lake & Skyline Views',
      facing: 'Maximum Natural Sunlight & Breezy Ventilation',
      imgSrc: 'images/estella-unit-plan-2.webp'
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const planKey = tab.getAttribute('data-plan');
      const data = floorPlanData[planKey];

      if (data) {
        titleEl.textContent = data.title;
        carpetEl.textContent = data.carpet;
        superEl.textContent = data.super;
        balconiesEl.textContent = data.balconies;
        facingEl.textContent = data.facing;
        if (planImg && data.imgSrc) {
          planImg.src = data.imgSrc;
        }
      }
    });
  });
}

/* ==========================================================================
   5. Urgency Countdown Timer (Special Township Benefit)
   ========================================================================== */
function initCountdownTimer() {
  const timerDisplay = document.getElementById('countdownTimer');
  if (!timerDisplay) return;

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + 4);
  targetDate.setHours(23, 59, 59);

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      timerDisplay.textContent = 'Special Offer Ending Today!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    timerDisplay.textContent = `${pad(days)}d : ${pad(hours)}h : ${pad(mins)}m : ${pad(secs)}s`;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   6. Live Social Proof Toast System (Urgency & Conversions)
   ========================================================================== */
function initSocialProofToast() {
  const toast = document.getElementById('socialProofToast');
  const toastName = document.getElementById('toastPersonName');
  const toastAction = document.getElementById('toastActionText');
  const toastTime = document.getElementById('toastTimeAgo');

  if (!toast || !toastName) return;

  const activities = [
    { name: 'Amit Shah', city: 'Thane West', action: 'enquired for 3 BHK Park View residence', time: '2 mins ago' },
    { name: 'Dr. Priya Kulkarni', city: 'Mulund West', action: 'booked a private township tour', time: '5 mins ago' },
    { name: 'Vikram Singhal', city: 'Powai', action: 'unlocked 2 BHK with Sundeck floor plan', time: '8 mins ago' },
    { name: 'Rohan & Neha Mehta', city: 'Bandra', action: 'requested Kalpataru Parkcity price sheet', time: '12 mins ago' },
    { name: 'Sanjay Malhotra', city: 'Ghodbunder Road', action: 'scheduled a VIP site visit appointment', time: '16 mins ago' }
  ];

  let currentIndex = 0;

  function showToast() {
    const activity = activities[currentIndex];
    toastName.textContent = `${activity.name} (${activity.city})`;
    toastAction.textContent = activity.action;
    toastTime.textContent = activity.time;

    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);

    currentIndex = (currentIndex + 1) % activities.length;
  }

  setTimeout(() => {
    showToast();
    setInterval(showToast, 20000);
  }, 4000);
}

/* ==========================================================================
   6b. Interactive Connectivity Accordion Toggle
   ========================================================================== */
function initConnectivityAccordion() {
  const groups = document.querySelectorAll('.connectivity-group');
  groups.forEach(group => {
    const header = group.querySelector('.connectivity-group-header');
    if (header) {
      header.addEventListener('click', () => {
        group.classList.toggle('collapsed');
        const icon = group.querySelector('.group-toggle-icon');
        if (icon) {
          icon.textContent = group.classList.contains('collapsed') ? '+' : '−';
        }
      });
    }
  });
}

/* ==========================================================================
   8. Mobile Navigation Toggle & Smooth Link Scrolling
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navbarMenu');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!menuBtn || !navMenu) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      navMenu.classList.remove('active');
    });
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id], div[id]');
    
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else if (link.getAttribute('href')?.startsWith('#')) {
            link.classList.remove('active');
          }
        });
      }
    });
  });
}
