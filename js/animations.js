/**
 * animations.js - Interaction and Intersection Observers
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initTypingEffect();
  initParallax();
  initCounters();
  initTestimonialSlider();
  initLogoStrip();
  initCategoryTilt();
  initNewsletter();
  initUnifiedHeroSlider();
});

// Expose for dynamic job list re-render
window.initScrollReveal = initScrollReveal;

// Intersection Observer for scroll animations
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal:not(.active)');
  if (!revealElements.length) return;

  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach((el) => revealOnScroll.observe(el));
}

// Typing Effect for Hero
let typingTimeoutId = null;
let currentTypingState = {
  wordIndex: 0,
  charIndex: 0,
  isDeleting: false
};

function initTypingEffect() {
  const textEl = document.getElementById('typed-text');
  if (!textEl) return;

  function type() {
    const words = JSON.parse(textEl.getAttribute('data-words') || '[]');
    if (!words.length) return;
    
    if (currentTypingState.wordIndex >= words.length) {
      currentTypingState.wordIndex = 0;
    }
    
    const currentWord = words[currentTypingState.wordIndex];
    let typeSpeed = 60;
    
    if (currentTypingState.isDeleting) {
      textEl.textContent = currentWord.substring(0, currentTypingState.charIndex - 1);
      currentTypingState.charIndex--;
      typeSpeed = 30;
    } else {
      textEl.textContent = currentWord.substring(0, currentTypingState.charIndex + 1);
      currentTypingState.charIndex++;
      typeSpeed = 60;
    }

    if (!currentTypingState.isDeleting && currentTypingState.charIndex === currentWord.length) {
      typeSpeed = 1000; // Pause at end of word
      currentTypingState.isDeleting = true;
    } else if (currentTypingState.isDeleting && currentTypingState.charIndex === 0) {
      currentTypingState.isDeleting = false;
      currentTypingState.wordIndex = (currentTypingState.wordIndex + 1) % words.length;
      typeSpeed = 300; // Pause before new word
    }

    typingTimeoutId = setTimeout(type, typeSpeed);
  }

  // Start typing after initial delay
  typingTimeoutId = setTimeout(type, 800);
}

// Function to reset/update typing words
window.updateHeroTypingWords = function(newWordsArray) {
  const textEl = document.getElementById('typed-text');
  if (!textEl) return;
  
  // Clear running timeout
  if (typingTimeoutId) {
    clearTimeout(typingTimeoutId);
  }
  
  // Update words attribute
  textEl.setAttribute('data-words', JSON.stringify(newWordsArray));
  textEl.textContent = '';
  
  // Reset typing state
  currentTypingState.wordIndex = 0;
  currentTypingState.charIndex = 0;
  currentTypingState.isDeleting = false;
  
  // Start typing loop again
  initTypingEffect();
}

// Parallax Effect for Backgrounds (rAF for 60fps)
function initParallax() {
  const parallaxEls = document.querySelectorAll('.parallax');
  if (!parallaxEls.length) return;
 
  let ticking = false;
 
  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach((el) => {
      const speed = parseFloat(el.getAttribute('data-speed')) || 0.3;
      el.style.transform = `translate3d(0, ${scrollY * speed}px, 0)`;
    });
    ticking = false;
  }
 
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
}
 
// Animated Counters
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;
 
  const counterOptions = {
    threshold: 0.5
  };
 
  const counterObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, counterOptions);
 
  counters.forEach(counter => {
    counterObserver.observe(counter);
  });
}
 
function startCounter(counterEl) {
  const target = +counterEl.getAttribute('data-target');
  const duration = 2000; // 2 seconds
  const increment = target / (duration / 16); // 60fps
  let current = 0;
 
  const updateCounter = () => {
    current += increment;
    if (current < target) {
      counterEl.textContent = Math.ceil(current);
      requestAnimationFrame(updateCounter);
    } else {
      counterEl.textContent = target;
    }
  };
 
  updateCounter();
}
 
// Duplicate logo track for seamless infinite scroll
function initLogoStrip() {
  const track = document.getElementById('logo-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
}
 
// Testimonial auto-slider
function initTestimonialSlider() {
  const track = document.getElementById('testimonial-track');
  const dotsContainer = document.getElementById('slider-dots');
  if (!track || !dotsContainer) return;
 
  const slides = track.querySelectorAll('.testimonial-slide');
  let current = 0;
  let interval;
 
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });
 
  const dots = dotsContainer.querySelectorAll('button');
 
  function goTo(index) {
    current = index;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }
 
  function next() {
    goTo((current + 1) % slides.length);
  }
 
  interval = setInterval(next, 5000);
  track.parentElement?.addEventListener('mouseenter', () => {
    clearInterval(interval);
    next(); // Automatically advance to the next testimonial on hover
  });
  track.parentElement?.addEventListener('mouseleave', () => {
    interval = setInterval(next, 5000);
  });
}
 
// Category card tilt on hover
function initCategoryTilt() {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
 
function initNewsletter() {
  document.getElementById('newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = '404.html';
  });
}
 
/**
 * Dynamic Hero content topics & slider
 */
const HERO_TOPICS = [
  {
    title: 'Build Your Career.<br>Discover <span class="text-glow">Tech Careers.</span>',
    sub: 'Connect with top-tier technology, AI, and software engineering companies worldwide. Your dream developer role is one search away.',
    words: ["Remote Developers", "Backend Engineers", "AI Scientists", "DevOps Experts"]
  },
  {
    title: 'Craft the Experience.<br>Discover <span class="text-glow">Creative Jobs.</span>',
    sub: 'Join design studios, top tech agencies, and world-class product teams. Elevate your career in UI/UX, branding, and motion design.',
    words: ["UI/UX Designers", "Art Directors", "Brand Strategists", "3D Illustrators"]
  },
  {
    title: 'Scale the Growth.<br>Discover <span class="text-glow">Finance Roles.</span>',
    sub: 'Step into high-impact finance, accounting, and strategic consulting positions with leading global firms and fast-growing unicorns.',
    words: ["Financial Analysts", "Investment Bankers", "Growth Leads", "Strategic Advisors"]
  },
  {
    title: 'Amplify the Story.<br>Discover <span class="text-glow">Marketing Paths.</span>',
    sub: 'Lead viral marketing campaigns, shape brand identities, and drive growth for dynamic companies hungry for creative content creators.',
    words: ["Growth Marketers", "SEO Specialists", "Content Directors", "Brand Managers"]
  },
  {
    title: 'Transform Lives.<br>Discover <span class="text-glow">Healthcare Jobs.</span>',
    sub: 'Explore rewarding positions in clinical care, medical research, and health tech systems. Make a difference with top healthcare providers.',
    words: ["Clinical Advisors", "Healthcare Managers", "Research Scientists", "Medical Leads"]
  },
  {
    title: 'Work from Anywhere.<br>Discover <span class="text-glow">Remote Careers.</span>',
    sub: 'Unshackle from the traditional desk. Work for global brands from the comfort of your home or any coworking space on the globe.',
    words: ["Digital Nomads", "Global Creators", "Remote Support", "Distributed Teams"]
  }
];
 
function initUnifiedHeroSlider() {
  const bgSlideshow = document.getElementById('hero-slideshow');
  const bgDotsContainer = document.getElementById('hero-slide-dots');
  
  const rightSlider = document.getElementById('hero-right-slider');
  const rightDotsWrap = document.getElementById('hero-right-dots');
  const rightCaptionEl = document.getElementById('hero-right-caption');
  
  const heroContent = document.querySelector('.hero-content');
  const h1El = heroContent?.querySelector('h1');
  const subEl = heroContent?.querySelector('.hero-sub');
  
  if (!bgSlideshow || !rightSlider) return;
 
  const bgSlides = [...bgSlideshow.querySelectorAll('.hero-slide')];
  const rightSlides = [...rightSlider.querySelectorAll('.hero-right-slide')];
  const total = bgSlides.length;
  
  let current = 0;
  let intervalId;
  const INTERVAL_MS = 4500; // 4.5 seconds interval as requested
 
  // Initialize background dots
  if (bgDotsContainer) {
    bgDotsContainer.innerHTML = '';
    bgSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.innerHTML = '<span class="hero-dot-progress"></span>';
      dot.addEventListener('click', () => goTo(i, true));
      bgDotsContainer.appendChild(dot);
    });
  }
 
  // Initialize right slider dots
  if (rightDotsWrap) {
    rightDotsWrap.innerHTML = '';
    rightSlides.forEach((slide, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-right-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', slide.dataset.caption || `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i, true));
      rightDotsWrap.appendChild(dot);
    });
  }
 
  const bgDots = bgDotsContainer ? [...bgDotsContainer.querySelectorAll('.hero-dot')] : [];
  const rightDots = rightDotsWrap ? [...rightDotsWrap.querySelectorAll('.hero-right-dot')] : [];
 
  function resetProgress() {
    bgDots.forEach((dot) => {
      const bar = dot.querySelector('.hero-dot-progress');
      if (bar) {
        bar.style.animation = 'none';
        void bar.offsetWidth;
        bar.style.animation = '';
      }
    });
  }
 
  function goTo(index, manual = false) {
    if (index === current && !manual) return;
 
    // 1. Transition Background Slideshow
    const prevBg = bgSlides[current];
    const nextBg = bgSlides[index];
 
    prevBg.classList.remove('active');
    prevBg.classList.add('exit');
    nextBg.classList.add('active');
    nextBg.classList.remove('exit');
 
    setTimeout(() => {
      prevBg.classList.remove('exit');
      const img = prevBg.querySelector('img');
      if (img) {
        img.style.animation = 'none';
        void img.offsetWidth;
        img.style.animation = '';
      }
    }, 1200);
 
    // 2. Transition Right Slideshow
    const prevRight = rightSlides[current];
    const nextRight = rightSlides[index];
 
    prevRight.classList.remove('active');
    prevRight.classList.add('exit');
    nextRight.classList.add('active');
    nextRight.classList.remove('exit');
 
    setTimeout(() => prevRight.classList.remove('exit'), 650);
 
    // Update Caption
    if (rightCaptionEl) {
      const text = rightSlides[index].dataset.caption || '';
      rightCaptionEl.style.opacity = '0';
      setTimeout(() => {
        rightCaptionEl.textContent = text;
        rightCaptionEl.style.opacity = '1';
      }, 200);
    }
 
    // 3. Transition Text Content with sliding effect
    if (heroContent && h1El && subEl && HERO_TOPICS[index]) {
      heroContent.classList.add('text-transition-exit');
      
      setTimeout(() => {
        const topic = HERO_TOPICS[index];
        h1El.innerHTML = topic.title;
        subEl.textContent = topic.sub;
        window.updateHeroTypingWords(topic.words);
        
        heroContent.classList.remove('text-transition-exit');
        heroContent.classList.add('text-transition-enter');
        
        // Force reflow
        void heroContent.offsetWidth;
        
        // Remove entering state to transition in
        heroContent.classList.remove('text-transition-enter');
      }, 200);
    }

    // 4. Update dots
    bgDots.forEach((d, i) => d.classList.toggle('active', i === index));
    rightDots.forEach((d, i) => d.classList.toggle('active', i === index));
    resetProgress();

    current = index;
    if (manual) restartAutoplay();
  }

  function nextSlide() {
    goTo((current + 1) % total);
  }

  function restartAutoplay() {
    clearInterval(intervalId);
    intervalId = setInterval(nextSlide, INTERVAL_MS);
  }

  // Preload slides
  bgSlides.slice(1).forEach((slide) => {
    const src = slide.querySelector('img')?.src;
    if (src) new Image().src = src;
  });
  rightSlides.slice(1).forEach((slide) => {
    const src = slide.querySelector('img')?.src;
    if (src) new Image().src = src;
  });

  restartAutoplay();
}
