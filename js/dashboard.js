/**
 * dashboard.js - Dashboard panels, charts, saved jobs sync
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!window.requireAuth('seeker')) return;

  initDashboardNav();
  initDashboardCharts();
  renderSavedJobsDashboard();
  loadUserProfile();
  initLogout();
});

function initLogout() {
  document.getElementById('logout-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCompany');
    window.location.href = 'login.html?role=seeker';
  });
}

function initDashboardNav() {
  const links = document.querySelectorAll('.nav-item[data-panel], .sidebar-nav a[data-panel]');
  const panels = document.querySelectorAll('.dashboard-panel');
  const title = document.getElementById('panel-title');

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const panel = link.dataset.panel;
      links.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      panels.forEach((p) => p.classList.remove('active'));
      document.getElementById(`panel-${panel}`)?.classList.add('active');
      const titles = { overview: 'Overview', applied: 'My Applications', saved: 'Saved Jobs', interviews: 'Interviews', messages: 'Messages' };
      if (title) title.textContent = titles[panel] || 'Dashboard';
      document.getElementById('dashboard-sidebar')?.classList.remove('open');
      if (panel === 'saved') renderSavedJobsDashboard();
    });
  });

  document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
    document.getElementById('dashboard-sidebar')?.classList.toggle('open');
  });

  document.getElementById('save-profile')?.addEventListener('click', () => {
    const name = document.getElementById('profile-name')?.value;
    if (name) localStorage.setItem('userName', name);
    window.showToast?.('Profile saved successfully');
  });
}

function initDashboardCharts() {
  const bars = document.querySelectorAll('#chart-bars .chart-bar');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        bars.forEach((bar) => {
          const h = bar.dataset.height || 50;
          bar.style.height = h + '%';
        });
        observer.disconnect();
      });
    },
    { threshold: 0.3 }
  );
  const chart = document.getElementById('chart-bars');
  if (chart) observer.observe(chart);
}

function renderSavedJobsDashboard() {
  const container = document.getElementById('saved-jobs-list');
  const empty = document.getElementById('saved-empty');
  const statSaved = document.getElementById('stat-saved');
  if (!container) return;

  const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
  if (statSaved) statSaved.textContent = saved.length;

  if (!saved.length) {
    if (empty) empty.style.display = 'block';
    return;
  }

  if (empty) empty.style.display = 'none';

  const jobMap = {
    1: { title: 'Senior Frontend Engineer', company: 'TechFlow', logo: 'job-list-1.webp' },
    2: { title: 'Product Designer', company: 'DesignHub', logo: 'job-list-2.webp' },
    3: { title: 'Data Scientist', company: 'DataCore', logo: 'job-list-3.webp' },
    4: { title: 'DevOps Engineer', company: 'CloudNine', logo: 'job-list-4.webp' },
    5: { title: 'Financial Analyst', company: 'FinTech Pro', logo: 'job-list-5.webp' },
    6: { title: 'Healthcare PM', company: 'HealthPlus', logo: 'job-list-6.webp' },
  };

  container.innerHTML = saved
    .map((id) => {
      const j = jobMap[id] || { title: 'Saved Job', company: 'Company', logo: 'company-techflow.webp' };
      return `
        <div class="dash-job-item">
          <img src="images/${j.logo}" alt="" loading="lazy" width="48" height="48">
          <div style="flex:1"><strong>${j.title}</strong><br><span style="color:var(--muted);font-size:0.875rem">${j.company}</span></div>
          <a href="job-details.html?id=${id}" class="btn btn-outline" style="padding:0.5rem 1rem">View</a>
        </div>`;
    })
    .join('');
}

function loadUserProfile() {
  const name = localStorage.getItem('userName') || 'Alex Morgan';
  const email = localStorage.getItem('userEmail') || 'alex@example.com';
  const nameEl = document.getElementById('user-name');
  
  if (nameEl) {
    if (nameEl.classList.contains('user-email')) {
      nameEl.textContent = email;
    } else {
      nameEl.textContent = name.split(' ')[0];
    }
  }
  
  // Set email in the new header if it exists
  const emailEl = document.querySelector('.user-email');
  if (emailEl) emailEl.textContent = email;
}
