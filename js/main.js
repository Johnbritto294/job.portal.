/**
 * main.js - Core functionality
 */

document.addEventListener('DOMContentLoaded', () => {
  initImageHoverMenuBlocker();
  initTheme();
  initPageLoader();
  initHeaderScroll();
  initCustomCursor();
  initScrollProgress();
  initMobileMenu();
  initRippleEffect();
  initSaveJobs();
  initActiveNav();
});

window.initSaveJobs = initSaveJobs;

// Prevent Edge's image hover menu / visual search controls from covering site images.
function initImageHoverMenuBlocker() {
  const protectImage = (img) => {
    img.setAttribute('draggable', 'false');
    img.setAttribute('data-no-visual-search', '');

    if (navigator.userAgent.includes('Edg/')) {
      img.setAttribute('inert', '');
    }
  };

  document.querySelectorAll('img').forEach(protectImage);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        if (node.matches?.('img')) {
          protectImage(node);
        }

        node.querySelectorAll?.('img').forEach(protectImage);
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Page Loader
function initPageLoader() {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 300);
    }, 700);
  }
}

// Dark Mode Toggle
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;
  const icon = themeToggleBtn?.querySelector('i');
  
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    body.classList.add('dark-mode');
    if (icon) icon.className = 'ph ph-sun';
  } else {
    if (icon) icon.className = 'ph ph-moon';
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const isDark = body.classList.contains('dark-mode');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      
      if (icon) {
        icon.className = isDark ? 'ph ph-sun' : 'ph ph-moon';
      }
    });
  }
}

// Header Scroll Effect
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Custom Cursor
function initCustomCursor() {
  // Only init on non-touch devices
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.classList.add('cursor-glow');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    requestAnimationFrame(() => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
    });
  });

  // Shrink cursor on click
  document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.8)');
  document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
}

// Scroll Progress Bar
function initScrollProgress() {
  const progressBar = document.createElement('div');
  progressBar.classList.add('scroll-progress');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

// Mobile Menu
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const closeBtn = document.getElementById('close-menu-btn');

  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    document.body.classList.remove('mobile-nav-open');
  };

  if (menuBtn && mobileNav && closeBtn) {
    menuBtn.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.classList.add('mobile-nav-open');
    });
    closeBtn.addEventListener('click', closeMobileNav);

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }
}

// Ripple Effect on Buttons
function initRippleEffect() {
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x - size / 2 + 'px';
      ripple.style.top = y - size / 2 + 'px';

      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Toast Notification System (Global utility)
window.showToast = function(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const icon = type === 'success' ? '<i class="ph ph-check-circle" style="color: var(--success); font-size: 1.5rem;"></i>' : '<i class="ph ph-warning-circle" style="color: var(--danger); font-size: 1.5rem;"></i>';
  
  toast.innerHTML = `${icon} <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Saved jobs via localStorage
function initSaveJobs() {
  const saved = getSavedJobs();

  document.querySelectorAll('.save-job-btn').forEach((btn) => {
    const id = btn.dataset.id;
    if (!id) return;

    updateSaveBtn(btn, saved.includes(String(id)));

    if (btn.dataset.bound) return;
    btn.dataset.bound = 'true';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleSaveJob(id, btn);
    });
  });
}

function getSavedJobs() {
  return JSON.parse(localStorage.getItem('savedJobs') || '[]');
}

function toggleSaveJob(id, btn) {
  let saved = getSavedJobs();
  const sid = String(id);
  if (saved.includes(sid)) {
    saved = saved.filter((x) => x !== sid);
    window.showToast('Job removed from saved');
  } else {
    saved.push(sid);
    window.showToast('Job saved successfully');
  }
  localStorage.setItem('savedJobs', JSON.stringify(saved));
  updateSaveBtn(btn, saved.includes(sid));
}

function updateSaveBtn(btn, isSaved) {
  btn.classList.toggle('saved', isSaved);
  const icon = btn.querySelector('i');
  if (icon) {
    icon.className = isSaved ? 'ph ph-bookmark' : 'ph ph-bookmark-simple';
  }
}

// Active Link Indicator based on current page
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
  
  navLinks.forEach(link => {
    let href = link.getAttribute('href') || '';
    // Strip query params or anchors if any
    const hrefClean = href.split('?')[0].split('#')[0];
    
    const isHome = currentPath === 'index.html' || currentPath === '';
    const isHrefHome = hrefClean === 'index.html' || href === '#home';
    
    const isActive = (isHome && isHrefHome) || (hrefClean && currentPath === hrefClean);
    link.classList.toggle('active', isActive);
  });
}
