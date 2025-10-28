// Meltdown tracking system with localStorage
let stressLevel = 0;
const maxStress = 5; // Number of clicks before meltdown
let stressBar;
let stressText;

// Load stress level from localStorage on page load
window.addEventListener('DOMContentLoaded', function() {
  // Load saved stress level
  const savedStress = localStorage.getItem('stressLevel');
  if (savedStress) {
    stressLevel = parseInt(savedStress);
    console.log('Loaded stress level:', stressLevel);
  }
  
  // Create stress bar container
  const stressContainer = document.createElement('div');
  stressContainer.id = 'stress-container';
  stressContainer.innerHTML = `
    <div id="stress-bar-wrapper">
      <div id="stress-bar"></div>
    </div>
    <p id="stress-text">Stress Level: ${stressLevel}/${maxStress}</p>
  `;
  document.body.appendChild(stressContainer);
  
  stressBar = document.getElementById('stress-bar');
  stressText = document.getElementById('stress-text');
  
  // Update display with saved stress
  updateStressDisplay();
  applyStressEffects();
  
  // Check if already at meltdown
  if (stressLevel >= maxStress) {
    triggerMeltdown();
  }
  
  // Track ALL links on the page, not just hallway-list
  const links = document.querySelectorAll('a');
  console.log('Found links:', links.length);
  
  links.forEach(link => {
    // Skip certain links
    const href = link.getAttribute('href') || '';
    const shouldSkip = href.includes('index.html') || 
                       href.includes('puzzle') || 
                       href === '' || 
                       href.startsWith('#') ||
                       link.textContent.includes('Go Back');
    
    if (!shouldSkip) {
      link.addEventListener('click', function(e) {
        console.log('Link clicked:', this.href);
        
        // Increase stress BEFORE navigating
        increaseStress();
        
        // Small delay to save stress level before page changes
        e.preventDefault();
        setTimeout(() => {
          window.location.href = this.href;
        }, 100);
      });
    }
  });
  
  // Add reset button
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.style.cssText = 'position: fixed; top: 75px; left: 20px; z-index: 100; padding: 5px 10px; background: rgba(255,255,255,0.2); color: white; border: 1px solid white; cursor: pointer; border-radius: 5px; font-size: 0.8rem;';
  resetBtn.addEventListener('click', function(e) {
    e.preventDefault();
    resetStress();
  });
  document.body.appendChild(resetBtn);
});

function increaseStress() {
  stressLevel++;
  console.log('Stress increased to:', stressLevel);
  localStorage.setItem('stressLevel', stressLevel);
  updateStressDisplay();
  
  // Visual feedback effects
  applyStressEffects();
  
  // Check for meltdown
  if (stressLevel >= maxStress) {
    triggerMeltdown();
  }
}

function updateStressDisplay() {
  const percentage = (stressLevel / maxStress) * 100;
  stressBar.style.width = percentage + '%';
  stressText.textContent = `Stress Level: ${stressLevel}/${maxStress}`;
  
  console.log('Updated display - percentage:', percentage);
  
  // Change color as stress increases
  if (stressLevel >= maxStress) {
    stressBar.style.backgroundColor = '#ff0000';
  } else if (stressLevel >= maxStress * 0.6) {
    stressBar.style.backgroundColor = '#ff6b6b';
  } else if (stressLevel >= maxStress * 0.3) {
    stressBar.style.backgroundColor = '#ffa500';
  } else {
    stressBar.style.backgroundColor = '#4CAF50';
  }
}

function applyStressEffects() {
  const body = document.body;
  
  if (stressLevel > 0) {
    // Increase page shake intensity
    const shakeSpeed = Math.max(0.1, 0.5 - (stressLevel * 0.08));
    body.style.animation = `shake ${shakeSpeed}s infinite`;
  }
  
  // Increase blob speed based on stress (if blobs exist on this page)
  if (typeof blobs !== 'undefined' && blobs.length > 0) {
    blobs.forEach(blob => {
      // Apply speed multiplier based on stress
      const multiplier = 1 + (stressLevel * 0.3);
      blob.vy = (-0.2 - Math.random() * 0.4) * multiplier;
    });
  }
  
  // Add visual distortion
  const contentWrapper = document.querySelector('.content-wrapper');
  if (contentWrapper) {
    contentWrapper.style.filter = `blur(${stressLevel * 0.5}px) brightness(${1 - stressLevel * 0.1})`;
  }
}

function triggerMeltdown() {
  // Prevent multiple overlays
  if (document.getElementById('meltdown-overlay')) {
    return;
  }
  
  // Create meltdown overlay
  const overlay = document.createElement('div');
  overlay.id = 'meltdown-overlay';
  overlay.innerHTML = `
    <div id="meltdown-content">
      <h1 class="meltdown-title">SENSORY OVERLOAD</h1>
      <p class="meltdown-message">Too much stimulation. Need to escape.</p>
      <a href="A-Tism_puzzle.html" class="calm-down-link">Go to Quiet Space</a>
      <button id="reset-stress" class="reset-button">Try Again</button>
    </div>
  `;
  document.body.appendChild(overlay);
  
  // Intense visual effects
  document.body.style.animation = 'intense-shake 0.2s infinite';
  
  // Add reset functionality
  document.getElementById('reset-stress').addEventListener('click', function(e) {
    e.preventDefault();
    resetStress();
    overlay.remove();
    document.body.style.animation = '';
  });
}

function resetStress() {
  stressLevel = 0;
  localStorage.setItem('stressLevel', 0);
  console.log('Stress reset to 0');
  updateStressDisplay();
  
  // Reset visual effects
  document.body.style.animation = '';
  const contentWrapper = document.querySelector('.content-wrapper');
  if (contentWrapper) {
    contentWrapper.style.filter = 'none';
  }
  
  // Reset blob speeds (if blobs exist)
  if (typeof blobs !== 'undefined' && blobs.length > 0) {
    blobs.forEach(blob => {
      blob.vy = -0.2 - Math.random() * 0.4;
    });
  }
}