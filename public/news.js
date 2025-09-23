document.addEventListener('DOMContentLoaded', function() {
  // Mobile toggle logic
  const nationalBtn = document.getElementById('nationalBtn');
  const internationalBtn = document.getElementById('internationalBtn');
  const nationalSection = document.getElementById('nationalSection');
  const internationalSection = document.getElementById('internationalSection');
  if (nationalBtn && internationalBtn && nationalSection && internationalSection) {
    nationalBtn.addEventListener('click', function() {
      nationalBtn.classList.add('border-primary', 'text-white');
      nationalBtn.classList.remove('border-gray-700', 'text-gray-400');
      internationalBtn.classList.remove('border-primary', 'text-white');
      internationalBtn.classList.add('border-gray-700', 'text-gray-400');
      nationalSection.classList.remove('hidden');
      internationalSection.classList.add('hidden');
    });
    internationalBtn.addEventListener('click', function() {
      internationalBtn.classList.add('border-primary', 'text-white');
      internationalBtn.classList.remove('border-gray-700', 'text-gray-400');
      nationalBtn.classList.remove('border-primary', 'text-white');
      nationalBtn.classList.add('border-gray-700', 'text-gray-400');
      internationalSection.classList.remove('hidden');
      nationalSection.classList.add('hidden');
    });
  }
  function toggleFinanceType(button) {
    const buttons = document.querySelectorAll('.category-toggle button');
    buttons.forEach(btn => {
      btn.classList.remove('border-primary', 'text-white');
      btn.classList.add('border-gray-700', 'text-gray-400');
    });
    button.classList.remove('border-gray-700', 'text-gray-400');
    button.classList.add('border-primary', 'text-white');
  }
    
  function initSwipe(stackId) {
    const stack = document.getElementById(stackId);
    let cards = Array.from(stack.querySelectorAll('.swipeable-card'));
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentCard = null;
  
    function updateCardsPosition() {
      cards = Array.from(stack.querySelectorAll('.swipeable-card'));
      cards.forEach((card, index) => {
        card.style.zIndex = cards.length - index;
        if (index === 0) {
          card.style.transform = '';
        } else {
          const scale = 0.97 - (index * 0.03);
          const translateY = 5 + (index * 5);
          card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }
      });
    }
  
    function handleTouchStart(e) {
      if (isDragging) return;
      const card = e.target.closest('.swipeable-card');
      if (!card || cards.indexOf(card) !== 0) return;
  
      isDragging = true;
      currentCard = card;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = 0;
  
      card.style.transition = 'none';
    }
  
    function handleTouchMove(e) {
      if (!isDragging || !currentCard) return;
  
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      const diffX = touchX - startX;
      const diffY = touchY - startY;
  
      if (Math.abs(diffX) > Math.abs(diffY)) {
        e.preventDefault();
        currentX = diffX;
        const rotate = diffX * 0.1;
        currentCard.style.transform = `translateX(${diffX}px) rotate(${rotate}deg)`;
      }
    }
  
    function handleTouchEnd() {
      if (!isDragging || !currentCard) return;
  
      isDragging = false;
      currentCard.style.transition = 'transform 0.3s ease-out';
  
      if (Math.abs(currentX) > 100) {
        const direction = currentX > 0 ? 1 : -1;
        currentCard.style.transform = `translateX(${direction * window.innerWidth}px) rotate(${direction * 30}deg)`;
  
        setTimeout(() => {
          stack.appendChild(currentCard);
          updateCardsPosition();
          currentCard = null;
        }, 300);
      } else {
        currentCard.style.transform = '';
        currentCard = null;
      }
    }
      
  
    stack.addEventListener('touchstart', handleTouchStart, false);
    stack.addEventListener('touchmove', handleTouchMove, { passive: false });
    stack.addEventListener('touchend', handleTouchEnd, false);
  
    updateCardsPosition();
  }
    
  initSwipe('swipeable-stack-national');
  initSwipe('swipeable-stack-international');
});