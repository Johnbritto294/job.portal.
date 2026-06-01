/**
 * auth.js - Role-based login & signup (Job Seeker / Recruiter)
 */

const ROLE_CONFIG = {
  seeker: {
    label: 'Job Seeker',
    loginBtn: 'Log In as Job Seeker',
    signupBtn: 'Create Job Seeker Account',
    loginBenefits: [
      'Browse & apply to jobs',
      'Save jobs & track applications',
      'Manage your profile',
    ],
    signupBenefits: [
      'Browse & apply to jobs',
      'Save jobs & track applications',
      'Manage your profile',
    ],
    dashboard: 'dashboard.html',
    nameLabel: 'Full name',
    namePlaceholder: 'Full name',
  },
  recruiter: {
    label: 'Recruiter',
    loginBtn: 'Log In as Recruiter',
    signupBtn: 'Create Recruiter Account',
    loginBenefits: [
      'Post and manage job listings',
      'Review applicant profiles',
      'Company hiring dashboard',
    ],
    signupBenefits: [
      'Post unlimited job listings',
      'Track applicants in one place',
      'Build your employer brand',
    ],
    dashboard: 'recruiter-dashboard.html',
    nameLabel: 'Your name',
    namePlaceholder: 'Recruiter full name',
  },
};

let currentRole = 'seeker';

document.addEventListener('DOMContentLoaded', () => {
  currentRole = getRoleFromURL() || localStorage.getItem('userRole') || 'seeker';
  initRoleSelector();
  initLoginForm();
  initSignupForm();
  initPasswordToggles();
});

function initPasswordToggles() {
  document.querySelectorAll('.password-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('input');
      const icon = btn.querySelector('i');
      if (input && icon) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        icon.className = isPassword ? 'ph ph-eye-slash' : 'ph ph-eye';
      }
    });
  });
}

function getRoleFromURL() {
  const role = new URLSearchParams(window.location.search).get('role');
  return role === 'recruiter' || role === 'seeker' ? role : null;
}

function getActiveRole() {
  const select = document.getElementById('role-select-dropdown');
  if (select) return select.value;
  const active = document.querySelector('#role-selector .role-option.active');
  return active?.dataset.role || currentRole;
}

function initRoleSelector() {
  const select = document.getElementById('role-select-dropdown');
  if (select) {
    select.value = currentRole;
    select.addEventListener('change', () => {
      currentRole = select.value;
      localStorage.setItem('userRole', currentRole);
      applyRoleUI(currentRole);
    });
    applyRoleUI(currentRole);
    return;
  }

  const selector = document.getElementById('role-selector');
  if (!selector) return;

  selector.querySelectorAll('.role-option').forEach((opt) => {
    if (opt.dataset.role === currentRole) {
      selector.querySelectorAll('.role-option').forEach((o) => {
        o.classList.remove('active');
        o.setAttribute('aria-selected', 'false');
      });
      opt.classList.add('active');
      opt.setAttribute('aria-selected', 'true');
    }

    opt.addEventListener('click', () => {
      selector.querySelectorAll('.role-option').forEach((o) => {
        o.classList.remove('active');
        o.setAttribute('aria-selected', 'false');
      });
      opt.classList.add('active');
      opt.setAttribute('aria-selected', 'true');
      currentRole = opt.dataset.role;
      localStorage.setItem('userRole', currentRole);
      applyRoleUI(currentRole);
    });
  });

  applyRoleUI(currentRole);
}

function applyRoleUI(role) {
  const cfg = ROLE_CONFIG[role];
  if (!cfg) return;

  const loginBenefits = document.getElementById('login-role-benefits');
  if (loginBenefits) {
    loginBenefits.innerHTML = ROLE_CONFIG[role].loginBenefits
      .map((b) => `<li><i class="ph ph-check-circle"></i> ${b}</li>`)
      .join('');
  }

  const signupBenefits = document.getElementById('signup-role-benefits');
  if (signupBenefits) {
    signupBenefits.innerHTML = ROLE_CONFIG[role].signupBenefits
      .map((b) => `<li><i class="ph ph-check-circle"></i> ${b}</li>`)
      .join('');
  }

  const submitBtn = document.querySelector('.btn-auth-submit .btn-text');
  if (submitBtn) {
    submitBtn.textContent = document.getElementById('login-form')
      ? cfg.loginBtn
      : cfg.signupBtn;
  }

  const signupLink = document.getElementById('signup-link-role');
  if (signupLink) {
    signupLink.href = `signup.html?role=${role}`;
    signupLink.textContent = `Sign up as ${cfg.label}`;
  }

  const loginLink = document.getElementById('login-link-role');
  if (loginLink) {
    loginLink.href = `login.html?role=${role}`;
    loginLink.textContent = `Log in as ${cfg.label}`;
  }

  const nameLabel = document.getElementById('signup-name-label');
  const nameInput = document.getElementById('signup-name');
  if (nameLabel) nameLabel.textContent = cfg.nameLabel;
  if (nameInput) nameInput.placeholder = cfg.namePlaceholder;

  document.querySelectorAll('.role-field-recruiter').forEach((el) => {
    el.hidden = role !== 'recruiter';
  });

  const companyInput = document.getElementById('signup-company');
  if (companyInput) {
    companyInput.required = role === 'recruiter';
  }
}

function showError(inputId, errorId, show) {
  const input = document.getElementById(inputId);
  const err = document.getElementById(errorId);
  if (input) input.classList.toggle('error', show);
  if (err) err.classList.toggle('show', show);
  return show;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function saveSession({ email, name, role, company }) {
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userRole', role);
  if (name) localStorage.setItem('userName', name);
  if (company) localStorage.setItem('userCompany', company);
  else localStorage.removeItem('userCompany');
}

function redirectByRole(role) {
  window.location.href = ROLE_CONFIG[role].dashboard;
}

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = getActiveRole();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    let valid = true;

    if (!isValidEmail(email)) valid = !showError('login-email', 'login-email-error', true);
    else showError('login-email', 'login-email-error', false);

    if (password.length < 6) valid = !showError('login-password', 'login-password-error', true);
    else showError('login-password', 'login-password-error', false);

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    const original = btnText.textContent;
    btnText.textContent = 'Logging in...';
    btn.disabled = true;

    saveSession({ email, role });

    setTimeout(() => {
      window.showToast?.(`Welcome back! Logged in as ${ROLE_CONFIG[role].label}`);
      redirectByRole(role);
    }, 300);
  });
}

function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const role = getActiveRole();
    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    const company = document.getElementById('signup-company')?.value.trim() || '';
    let valid = true;

    if (role === 'recruiter' && !company) {
      valid = !showError('signup-company', 'signup-company-error', true);
    } else {
      showError('signup-company', 'signup-company-error', false);
    }

    if (!name) valid = !showError('signup-name', 'signup-name-error', true);
    else showError('signup-name', 'signup-name-error', false);

    if (!isValidEmail(email)) valid = !showError('signup-email', 'signup-email-error', true);
    else showError('signup-email', 'signup-email-error', false);

    if (password.length < 8) valid = !showError('signup-password', 'signup-password-error', true);
    else showError('signup-password', 'signup-password-error', false);

    if (password !== confirm) valid = !showError('signup-confirm', 'signup-confirm-error', true);
    else showError('signup-confirm', 'signup-confirm-error', false);

    const terms = document.getElementById('signup-terms');
    if (terms && !terms.checked) {
      valid = !showError('signup-terms', 'signup-terms-error', true);
    } else {
      showError('signup-terms', 'signup-terms-error', false);
    }

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    const btnText = btn.querySelector('.btn-text');
    btnText.textContent = 'Creating account...';
    btn.disabled = true;

    saveSession({ email, name, role, company });

    setTimeout(() => {
      window.showToast?.(`${ROLE_CONFIG[role].label} account created!`);
      redirectByRole(role);
    }, 300);
  });
}

/** Guard dashboards — call from dashboard pages */
window.requireAuth = function (expectedRole) {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = `login.html?role=${expectedRole || 'seeker'}`;
    return false;
  }
  const role = localStorage.getItem('userRole') || 'seeker';
  if (expectedRole && role !== expectedRole) {
    redirectByRole(role);
    return false;
  }
  return true;
};
