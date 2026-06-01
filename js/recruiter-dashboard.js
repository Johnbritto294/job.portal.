/**
 * recruiter-dashboard.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // Auth guard disabled — page opens directly

  const name = localStorage.getItem('userName') || 'Recruiter';
  const company = localStorage.getItem('userCompany') || 'Your Company';
  const email = localStorage.getItem('userEmail') || '';

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setText('user-name', email || 'recruiter@stackly.com');
  setText('user-company', company);

  const profileCompany = document.getElementById('profile-company');
  const profileName = document.getElementById('profile-recruiter-name');
  const profileEmail = document.getElementById('profile-email');
  if (profileCompany) profileCompany.value = company;
  if (profileName) profileName.value = name;
  if (profileEmail) profileEmail.value = email;

  initDashboardNav();
  initDashboardCharts();
  initLogout();
});

function initDashboardNav() {
  const links = document.querySelectorAll('.nav-item[data-panel], .dropdown-menu-links a[data-panel]');
  const panels = document.querySelectorAll('.dashboard-panel');
  const title = document.getElementById('panel-title');
  const titles = {
    overview: 'Recruiter Overview',
    jobs: 'Posted Jobs',
    applicants: 'Applicants',
    company: 'Company Profile',
  };

  function switchToPanel(panel) {
    links.forEach((l) => l.classList.remove('active'));
    panels.forEach((p) => p.classList.remove('active'));
    document.getElementById(`panel-${panel}`)?.classList.add('active');
    if (title) title.textContent = titles[panel] || 'Dashboard';
    const navItems = document.querySelectorAll('.dashboard-nav-horizontal .nav-item');
    navItems.forEach((i) => i.classList.remove('active'));
    navItems.forEach((item) => {
      if (item.dataset.panel === panel) item.classList.add('active');
    });
    // Also highlight matching dropdown links
    links.forEach((l) => {
      if (l.dataset.panel === panel) l.classList.add('active');
    });
    localStorage.setItem('activePanel', panel);
  }

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchToPanel(link.dataset.panel);
    });
  });

  // Restore last active panel on reload
  const savedPanel = localStorage.getItem('activePanel');
  if (savedPanel && document.getElementById(`panel-${savedPanel}`)) {
    switchToPanel(savedPanel);
  }

  // Clear error on input
['profile-company', 'profile-recruiter-name', 'profile-email'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    const errorEl = document.getElementById(`${id}-error`);
    if (errorEl) errorEl.classList.remove('show');
  });
});

// Industry input (no specific ID, but we can query it)
const industryInput = document.querySelector('.profile-form-grid input[placeholder="e.g. Technology"]');
if (industryInput) {
  industryInput.addEventListener('input', () => {
    const errorEl = document.getElementById('profile-industry-error');
    if (errorEl) errorEl.classList.remove('show');
  });
}

document.getElementById('save-profile-btn')?.addEventListener('click', (e) => {
  e.preventDefault();
  
  // Get form values
  const companyInput = document.getElementById('profile-company');
  const nameInput = document.getElementById('profile-recruiter-name');
  const emailInput = document.getElementById('profile-email');
  const industryInput = document.querySelector('.profile-form-grid input[placeholder="e.g. Technology"]');
  
  const company = companyInput?.value?.trim() || '';
  const name = nameInput?.value?.trim() || '';
  const email = emailInput?.value?.trim() || '';
  const industry = industryInput?.value?.trim() || '';
  
  // Reset errors
  const errors = [];
  const errorElements = [
    { id: 'profile-company-error', value: company, message: 'Company name is required' },
    { id: 'profile-email-error', value: email, message: 'Please enter a valid email address', validate: (val) => {
      // Basic email regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(val);
    } }
  ];
  
  let isValid = true;
  
  errorElements.forEach(({id, value, message, validate}) => {
    const errorEl = document.getElementById(id);
    let isFieldValid = true;
    
    if (!value) {
      isFieldValid = false;
    } else if (validate && !validate(value)) {
      isFieldValid = false;
    }
    
    if (!isFieldValid) {
      isValid = false;
      errors.push(message);
      if (errorEl) errorEl.classList.add('show');
    } else if (errorEl) {
      errorEl.classList.remove('show');
    }
  });
  
  if (!isValid) {
    // Show first error as toast for immediate feedback
    if (errors.length > 0) {
      window.showToast?.(errors[0]);
    }
    return;
  }
  
  // All valid - save data
  if (company) localStorage.setItem('userCompany', company);
  if (name) localStorage.setItem('userName', name);
  if (email) localStorage.setItem('userEmail', email);
  
  const compEl = document.getElementById('user-company');
  if (compEl) compEl.textContent = company || 'Company';
  
  setTimeout(() => { window.location.href = '404.html'; }, 400);
});
}

function initDashboardCharts() {
  const bars = document.querySelectorAll('#chart-bars .chart-bar');
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      bars.forEach((bar) => {
        bar.style.height = (bar.dataset.height || 50) + '%';
      });
      observer.disconnect();
    },
    { threshold: 0.3 }
  );
  const chart = document.getElementById('chart-bars');
  if (chart) observer.observe(chart);
}

function initLogout() {
  document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCompany');
    window.location.href = 'login.html?role=recruiter';
  });
}
