/**
 * jobs.js - Job listings, filtering, details, similar slider
 */

function jobThumb(id) {
  return `job-list-${((id - 1) % 6) + 1}.webp`;
}

function jobCompanyLogo(id) {
  return `job-company-${((id - 1) % 6) + 1}.webp`;
}

const JOBS_DATA = [
  { id: 1, title: 'Senior Frontend Engineer', company: 'TechFlow', logo: jobThumb(1), salary: 140, salaryLabel: '$120k – $160k', location: 'Remote', type: 'remote', experience: 'senior', tags: ['React', 'TypeScript'] },
  { id: 2, title: 'Product Designer', company: 'DesignHub', logo: jobThumb(2), salary: 112, salaryLabel: '$95k – $130k', location: 'New York', type: 'full-time', experience: 'mid', tags: ['Figma', 'UI/UX'] },
  { id: 3, title: 'Data Scientist', company: 'DataCore', logo: jobThumb(3), salary: 162, salaryLabel: '$140k – $185k', location: 'Boston', type: 'full-time', experience: 'senior', tags: ['Python', 'ML'] },
  { id: 4, title: 'DevOps Engineer', company: 'CloudNine', logo: jobThumb(4), salary: 130, salaryLabel: '$110k – $150k', location: 'Remote', type: 'remote', experience: 'mid', tags: ['AWS', 'K8s'] },
  { id: 5, title: 'Financial Analyst', company: 'FinTech Pro', logo: jobThumb(5), salary: 100, salaryLabel: '$85k – $115k', location: 'Chicago', type: 'full-time', experience: 'mid', tags: ['Excel', 'SQL'] },
  { id: 6, title: 'Healthcare PM', company: 'HealthPlus', logo: jobThumb(6), salary: 117, salaryLabel: '$100k – $135k', location: 'Hybrid', type: 'full-time', experience: 'senior', tags: ['Agile', 'HIPAA'] },
  { id: 7, title: 'Marketing Manager', company: 'GrowthLab', logo: jobThumb(7), salary: 95, salaryLabel: '$80k – $110k', location: 'LA', type: 'full-time', experience: 'mid', tags: ['SEO', 'Content'] },
  { id: 8, title: 'Junior Developer', company: 'StartupX', logo: jobThumb(8), salary: 65, salaryLabel: '$55k – $75k', location: 'Austin', type: 'full-time', experience: 'entry', tags: ['JavaScript', 'Node'] },
  { id: 9, title: 'Contract UX Researcher', company: 'UserFirst', logo: jobThumb(9), salary: 90, salaryLabel: '$70k – $90k', location: 'Remote', type: 'contract', experience: 'mid', tags: ['Research', 'UX'] },
  { id: 10, title: 'Engineering Director', company: 'ScaleUp', logo: jobThumb(10), salary: 195, salaryLabel: '$170k – $220k', location: 'SF', type: 'full-time', experience: 'lead', tags: ['Leadership', 'Architecture'] },
  { id: 11, title: 'Part-time Content Writer', company: 'MediaCo', logo: jobThumb(11), salary: 45, salaryLabel: '$35k – $50k', location: 'Remote', type: 'part-time', experience: 'entry', tags: ['Writing', 'SEO'] },
  { id: 12, title: 'Cloud Architect', company: 'CloudNine', logo: jobThumb(12), salary: 175, salaryLabel: '$150k – $200k', location: 'Seattle', type: 'full-time', experience: 'lead', tags: ['Azure', 'AWS'] },
];

const JOB_DETAILS = {
  1: { title: 'Senior Frontend Engineer', company: 'TechFlow Inc.', logo: jobCompanyLogo(1), cover: 'job-feature-1.webp', salary: '$120k – $160k', location: 'Remote, USA', skills: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'CSS3', 'Jest'] },
  2: { title: 'Product Designer', company: 'DesignHub', logo: jobCompanyLogo(2), cover: 'job-feature-2.webp', salary: '$95k – $130k', location: 'New York, NY', skills: ['Figma', 'UI/UX', 'Prototyping'] },
  3: { title: 'Data Scientist', company: 'DataCore', logo: jobCompanyLogo(3), cover: 'job-feature-3.webp', salary: '$140k – $185k', location: 'Boston, MA', skills: ['Python', 'TensorFlow', 'SQL'] },
  4: { title: 'DevOps Engineer', company: 'CloudNine', logo: jobCompanyLogo(4), cover: 'job-feature-4.webp', salary: '$110k – $150k', location: 'Remote', skills: ['AWS', 'Docker', 'Kubernetes'] },
  5: { title: 'Financial Analyst', company: 'FinTech Pro', logo: jobCompanyLogo(5), cover: 'job-feature-5.webp', salary: '$85k – $115k', location: 'Chicago, IL', skills: ['Excel', 'SQL', 'Modeling'] },
  6: { title: 'Healthcare PM', company: 'HealthPlus', logo: jobCompanyLogo(6), cover: 'job-feature-6.webp', salary: '$100k – $135k', location: 'Hybrid', skills: ['Agile', 'HIPAA', 'Stakeholder Mgmt'] },
};

let jobsVisible = 6;
let filteredJobs = [...JOBS_DATA];

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('jobs-list')) initJobsPage();
  if (document.getElementById('job-detail-header')) initJobDetailsPage();
  initSimilarSlider();
});

function salaryInRange(salary, ranges) {
  if (!ranges.length) return true;
  return ranges.some((r) => {
    if (r === '0-80') return salary < 80;
    if (r === '80-120') return salary >= 80 && salary < 120;
    if (r === '120-160') return salary >= 120 && salary < 160;
    if (r === '160+') return salary >= 160;
    return false;
  });
}

function getCheckedValues(container) {
  return [...container.querySelectorAll('input:checked')].map((i) => i.value);
}

function applyFilters() {
  const typeEl = document.querySelector('[data-filter="type"]');
  const salaryEl = document.querySelector('[data-filter="salary"]');
  const expEl = document.querySelector('[data-filter="experience"]');
  if (!typeEl) return;

  const types = getCheckedValues(typeEl);
  const salaries = getCheckedValues(salaryEl);
  const experiences = getCheckedValues(expEl);

  filteredJobs = JOBS_DATA.filter((job) => {
    const typeMatch = !types.length || types.includes(job.type);
    const salaryMatch = salaryInRange(job.salary, salaries);
    const expMatch = !experiences.length || experiences.includes(job.experience);
    return typeMatch && salaryMatch && expMatch;
  });

  const sort = document.getElementById('sort-jobs')?.value;
  if (sort === 'salary-high') filteredJobs.sort((a, b) => b.salary - a.salary);
  else if (sort === 'salary-low') filteredJobs.sort((a, b) => a.salary - b.salary);

  jobsVisible = 6;
  renderJobList();
}

function renderJobCard(job) {
  return `
    <article class="job-list-card glass reveal fade-up" data-id="${job.id}"
      data-type="${job.type}" data-salary="${job.salary}" data-experience="${job.experience}">
      <img src="images/${job.logo}" alt="${job.company}" loading="lazy" width="64" height="64" style="border-radius:12px;object-fit:cover">
      <div class="job-list-info">
        <h3><a href="404.html">${job.title}</a></h3>
        <div class="job-list-meta">
          <span><i class="ph ph-buildings"></i> ${job.company}</span>
          <span><i class="ph ph-map-pin"></i> ${job.location}</span>
          <span><i class="ph ph-currency-dollar"></i> ${job.salaryLabel}</span>
        </div>
        <div class="job-tags" style="margin-top:0.75rem">${job.tags.map((t) => `<span>${t}</span>`).join('')}</div>
      </div>
      <button class="save-job-btn" data-id="${job.id}" aria-label="Save"><i class="ph ph-bookmark-simple"></i></button>
      <a href="404.html" class="btn btn-primary">View</a>
    </article>`;
}

function renderJobList(showSkeleton = false) {
  const list = document.getElementById('jobs-list');
  const countEl = document.getElementById('job-count');
  if (!list) return;

  if (showSkeleton) {
    list.innerHTML = Array(3).fill('<div class="skeleton skeleton-card"></div>').join('');
    setTimeout(() => renderJobList(false), 200);
    return;
  }

  const slice = filteredJobs.slice(0, jobsVisible);
  list.innerHTML = slice.map(renderJobCard).join('');
  if (countEl) countEl.textContent = filteredJobs.length;

  if (window.initSaveJobs) window.initSaveJobs();
  if (window.initScrollReveal) window.initScrollReveal();
}

function initJobsPage() {
  renderJobList(true);

  document.querySelectorAll('.filter-options input').forEach((input) => {
    input.addEventListener('change', applyFilters);
  });

  document.getElementById('sort-jobs')?.addEventListener('change', applyFilters);

  document.getElementById('clear-filters')?.addEventListener('click', () => {
    document.querySelectorAll('.filter-options input').forEach((i) => (i.checked = false));
    document.querySelector('[data-filter="type"] input[value="full-time"]').checked = true;
    document.querySelector('[data-filter="salary"] input[value="80-120"]').checked = true;
    document.querySelector('[data-filter="experience"] input[value="mid"]').checked = true;
    applyFilters();
  });

  document.getElementById('load-more-btn')?.addEventListener('click', () => {
    const btn = document.getElementById('load-more-btn');
    jobsVisible = Math.min(jobsVisible + 6, filteredJobs.length);
    renderJobList();
    if (jobsVisible >= filteredJobs.length) {
      btn.textContent = 'All jobs loaded';
      btn.disabled = true;
      window.showToast?.('All jobs loaded');
    }
  });

  const params = new URLSearchParams(location.search);
  if (params.get('category')) {
    window.showToast?.(`Filtering: ${params.get('category')}`);
  }
}

function initJobDetailsPage() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || '1';
  const job = JOB_DETAILS[id] || JOB_DETAILS[1];

  document.getElementById('detail-title').textContent = job.title;
  document.getElementById('detail-company').textContent = job.company;
  document.getElementById('detail-location').textContent = job.location;
  document.getElementById('detail-salary').textContent = job.salary;
  document.getElementById('sticky-title').textContent = job.title;
  document.getElementById('sticky-company').textContent = job.company.split(' ')[0];

  const logo = document.getElementById('detail-logo');
  if (logo) logo.src = `images/${job.logo}`;

  const skills = document.getElementById('detail-skills');
  if (skills) skills.innerHTML = job.skills.map((s) => `<span>${s}</span>`).join('');

  document.querySelectorAll('.save-job-btn').forEach((btn) => {
    btn.dataset.id = id;
  });

  const applyBar = document.getElementById('sticky-apply');
  if (applyBar) {
    const observer = new IntersectionObserver(
      ([e]) => applyBar.classList.toggle('visible', !e.isIntersecting),
      { threshold: 0 }
    );
    const hero = document.querySelector('.job-detail-header');
    if (hero) observer.observe(hero);
  }
}

function initSimilarSlider() {
  const track = document.getElementById('similar-track');
  const prev = document.getElementById('similar-prev');
  const next = document.getElementById('similar-next');
  if (!track) return;

  let index = 0;
  const cardWidth = 296;

  function update() {
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  prev?.addEventListener('click', () => {
    index = Math.max(0, index - 1);
    update();
  });
  next?.addEventListener('click', () => {
    const max = track.children.length - 1;
    index = Math.min(max, index + 1);
    update();
  });
}
