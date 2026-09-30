/**
 * ICONIC OFFICES - THANE-BELAPUR ROAD COMMERCIAL LANDING PAGE
 * Optimized for High-Converting Google Ads Campaigns
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

  if (!modal) return;

  // Open modal triggers
  const triggerButtons = document.querySelectorAll('[data-open-modal]');
  triggerButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const context = btn.getAttribute('data-context') || 'brochure';
      
      // Customize modal text based on button clicked
      if (context === 'pricing') {
        modalTitle.textContent = 'Unlock Exclusive Price & Cost Sheet';
        modalSubtitle.textContent = 'Enter your details to receive unit-wise all-inclusive pricing breakdown.';
      } else if (context === 'floorplan') {
        modalTitle.textContent = 'Download High-Res 2D & 3D Floor Plans';
        modalSubtitle.textContent = 'Get detailed carpet area, architectural blueprints & layout PDFs.';
      } else if (context === 'sitevisit') {
        modalTitle.textContent = 'Schedule a VIP Private Site Visit';
        modalSubtitle.textContent = 'Complimentary luxury cab pick & drop service available.';
      } else {
        modalTitle.textContent = 'Download Official Project Brochure';
        modalSubtitle.textContent = 'Get the complete e-brochure, floor layouts & payment plan PDF instantly.';
      }

      openModal();
    });
  });

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset to form view if was previously in success state
    modalFormContainer.style.display = 'block';
    successState.classList.remove('active');
    modalForm.reset();
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
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
    const originalText = submitBtn.innerHTML;

    // Simulate validation & loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin" style="animation: spin 1s linear infinite; width:18px; height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
      Processing Your Request...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Trigger automatic simulated file download
      triggerBrochureDownload();

      if (isInsideModal) {
        modalFormContainer.style.display = 'none';
        successState.classList.add('active');
      } else {
        // Hero form submitted -> open modal in success state
        modalTitle.textContent = 'Request Received Successfully!';
        modalSubtitle.textContent = 'Your official brochure & price sheet is downloading.';
        modalFormContainer.style.display = 'none';
        successState.classList.add('active');
        openModal();
      }
    }, 900);
  }

  // Simulated PDF download creation
  function triggerBrochureDownload() {
    const sampleContent = `ICONIC OFFICES - THE BIGGEST COMMERCIAL ICON OF THANE-BELAPUR ROAD
======================================================
Location: Thane-Belapur Road, Navi Mumbai
Configurations: Iconic Commercial Office Suites
Starting Price: INR 99.99 Lacs* onwards
RERA Reg No: P51700034567

Thank you for your interest! A dedicated commercial advisory manager 
has been assigned to your query and will connect shortly with inventory & floor plans.
======================================================`;

    const blob = new Blob([sampleContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Iconic-Offices-Thane-Belapur-Brochure.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  if (!tabs.length || !titleEl) return;

  const floorPlanData = {
    '539sqft-suite': {
      title: '539 Sq. Ft. Carpet Boutique Office Suite',
      carpet: '539 Sq.Ft. Carpet Area',
      super: '1,078 Sq.Ft. Super Built-up',
      balconies: 'Park View & City Skyline Options',
      facing: 'East Facing / Expressway Frontage'
    },
    '610sqft-executive': {
      title: '610 Sq. Ft. Carpet Executive Suite',
      carpet: '610 Sq.Ft. Carpet Area',
      super: '1,220 Sq.Ft. Super Built-up',
      balconies: 'Dual Corner Floor-to-Ceiling Glazing',
      facing: 'Corner Unit with Maximum Natural Daylight'
    },
    '1310sqft-corporate': {
      title: '1,310 Sq. Ft. Carpet Corporate Headquarters Suite',
      carpet: '1,310 Sq.Ft. Carpet Area',
      super: '2,620 Sq.Ft. Super Built-up',
      balconies: '180° Panoramic Skyline Views',
      facing: 'Grand Front-Facing Corporate Layout'
    },
    '1365sqft-iconic': {
      title: '1,365 Sq. Ft. Carpet Iconic Flagship Suite',
      carpet: '1,365 Sq.Ft. Carpet Area',
      super: '2,730 Sq.Ft. Super Built-up',
      balconies: 'High-Visibility Dual Aspect Glazing',
      facing: 'Premier Highway Frontage & Expansive Workspaces'
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
      }
    });
  });
}

/* ==========================================================================
   5. Urgency Countdown Timer (Pre-Launch Benefit)
   ========================================================================== */
function initCountdownTimer() {
  const timerDisplay = document.getElementById('countdownTimer');
  if (!timerDisplay) return;

  // Set target date 4 days from now
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
    { name: 'Karan Mehta', city: 'Mahape IT Park', action: 'booked a VIP commercial site visit', time: '2 mins ago' },
    { name: 'Dr. Suresh Patil', city: 'Vashi Sector 17', action: 'downloaded 539 Sq.Ft. cost sheet', time: '4 mins ago' },
    { name: 'Rajiv Khanna', city: 'Airoli Mindspace', action: 'unlocked 610 Sq.Ft. corner layout', time: '7 mins ago' },
    { name: 'Apex Logistics Ltd.', city: 'Thane West', action: 'reserved 1,365 Sq.Ft. Corporate Suite', time: '11 mins ago' },
    { name: 'Sunil Desai', city: 'BKC, Mumbai', action: 'requested commercial ROI & payment plan', time: '15 mins ago' }
  ];

  let currentIndex = 0;

  function showToast() {
    const activity = activities[currentIndex];
    toastName.textContent = `${activity.name} (${activity.city})`;
    toastAction.textContent = activity.action;
    toastTime.textContent = activity.time;

    toast.classList.add('show');

    // Auto hide after 5 seconds
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);

    currentIndex = (currentIndex + 1) % activities.length;
  }

  // Show first toast after 4 seconds, then repeat every 20 seconds
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
   7. Hero Banner Interactive Image Switcher
   ========================================================================== */
function initBannerSwitcher() {
  const thumbButtons = document.querySelectorAll('.banner-interactive-thumbs .thumb-btn');
  const bannerImg = document.getElementById('heroMainBannerImg');
  const captionTitle = document.getElementById('bannerCaptionTitle');
  const captionSub = document.getElementById('bannerCaptionSub');

  if (!thumbButtons.length || !bannerImg) return;

  thumbButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const newSrc = btn.getAttribute('data-img-src');
      const newTitle = btn.getAttribute('data-img-title');
      const newSub = btn.getAttribute('data-img-sub');

      // Subtle fade effect
      bannerImg.style.opacity = '0.4';
      setTimeout(() => {
        bannerImg.src = newSrc;
        if (captionTitle) captionTitle.textContent = newTitle;
        if (captionSub) captionSub.textContent = newSub;
        bannerImg.style.opacity = '1';
      }, 150);
    });
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

  // Close menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      navMenu.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      navMenu.classList.remove('active');
    }
  });

  // Highlight active link based on scroll position
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


