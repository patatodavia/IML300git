document.addEventListener('DOMContentLoaded', function() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const autoplayBtn = document.querySelector('.autoplay-toggle');

  let current = 0;
  let autoplayInterval = null;
  let isPlaying = true;
  const AUTOPLAY_DELAY = 5000;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  { goTo(current - 1); resetAutoplay(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); resetAutoplay(); }
  });

  // Autoplay
  function startAutoplay() {
    autoplayInterval = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
    isPlaying = true;
    autoplayBtn.innerHTML = '&#9646;&#9646; pause';
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
    isPlaying = false;
    autoplayBtn.innerHTML = '&#9654; play';
  }

  function resetAutoplay() {
    if (isPlaying) { stopAutoplay(); startAutoplay(); }
  }

  autoplayBtn.addEventListener('click', () => {
    isPlaying ? stopAutoplay() : startAutoplay();
  });

  startAutoplay();
});