/**
 * زینو لایف (Zino Life) - پلتفرم جامع روانشناسی و رشد فردی
 * Vanilla JavaScript Engine for GitHub Pages
 */

// ==========================================
// 1. SHOPPING CART & LOCAL STORAGE MANAGER
// ==========================================
const CART_STORAGE_KEY = 'zinolife_cart_items_v1';

const defaultDemoItems = [
  {
    id: 'book-reinventing-life',
    title: 'زندگی خود را دوباره بیافرینید',
    author: 'جفری یانگ، جنت کلوسکو',
    price: 310000,
    quantity: 1,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgOvmArua25o6bO5pDaagFwyBjN9osXPfZa39uDVE-mJhdfNnTBPRTyY4zD3R0lPGg4QSOsPk7GEBl8I9YFMPNmuJMZWhva7mDoTvdzkG53qTc_A9hhN1HG4HqOlKZ5-3kr-y7xJkNTWoKnvyCy-7sZotUW3qn0V1Es2jXAUZK53mDTMSfmiFsocjXymKkPON1EWjnpa43jEigvXVIMfGcobBXx1VaN2XgTBLAttgP9rD3EOPQrXHw'
  }
];

function getCartItems() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(defaultDemoItems));
      return defaultDemoItems;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultDemoItems;
  }
}

function saveCartItems(items) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    renderCart();
  } catch (e) {
    console.error('Error saving cart', e);
  }
}

function addToCart(title, price, author = '', image = '') {
  const items = getCartItems();
  const existing = items.find(item => item.title === title);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({
      id: 'item-' + Date.now(),
      title,
      author: author || 'انتشارات زینو لایف',
      price: Number(price),
      quantity: 1,
      image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgOvmArua25o6bO5pDaagFwyBjN9osXPfZa39uDVE-mJhdfNnTBPRTyY4zD3R0lPGg4QSOsPk7GEBl8I9YFMPNmuJMZWhva7mDoTvdzkG53qTc_A9hhN1HG4HqOlKZ5-3kr-y7xJkNTWoKnvyCy-7sZotUW3qn0V1Es2jXAUZK53mDTMSfmiFsocjXymKkPON1EWjnpa43jEigvXVIMfGcobBXx1VaN2XgTBLAttgP9rD3EOPQrXHw'
    });
  }
  saveCartItems(items);
  showToast(`«${title}» به سبد خرید اضافه شد.`);
}

function removeFromCart(title) {
  let items = getCartItems();
  items = items.filter(item => item.title !== title);
  saveCartItems(items);
  showToast('آیتم از سبد خرید حذف شد.');
}

function updateCartQuantity(title, delta) {
  const items = getCartItems();
  const item = items.find(i => i.title === title);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(title);
      return;
    }
  }
  saveCartItems(items);
}

function toggleCartDrawer(open) {
  const drawer = document.getElementById('quick-cart-drawer');
  const overlay = document.getElementById('cart-backdrop');
  if (drawer) {
    if (open) {
      drawer.classList.remove('-translate-x-full');
      if (overlay) overlay.classList.remove('hidden');
    } else {
      drawer.classList.add('-translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    }
  }
}

function quickCheckout(title, price, author = '', image = '') {
  addToCart(title, price, author, image);
  toggleCartDrawer(true);
}

function renderCart() {
  const items = getCartItems();
  const container = document.getElementById('cart-items-container');
  const totalPriceEl = document.getElementById('cart-total-price');
  const countBadges = document.querySelectorAll('.cart-badge');

  let totalSum = 0;
  let totalCount = 0;

  items.forEach(item => {
    totalSum += item.price * item.quantity;
    totalCount += item.quantity;
  });

  countBadges.forEach(badge => {
    badge.textContent = totalCount.toLocaleString('fa-IR');
    badge.style.display = totalCount > 0 ? 'flex' : 'none';
  });

  if (totalPriceEl) {
    totalPriceEl.textContent = totalSum.toLocaleString('fa-IR') + ' تومان';
  }

  if (container) {
    if (items.length === 0) {
      container.innerHTML = `
        <div class="py-12 text-center text-outline flex flex-col items-center justify-center">
          <span class="material-symbols-outlined text-4xl mb-2 text-outline-variant">remove_shopping_cart</span>
          <p class="font-body-md">سبد خرید شما خالی است.</p>
          <a href="products.html" class="mt-4 px-4 py-2 bg-secondary text-on-secondary rounded-full text-xs font-bold hover:bg-primary transition-colors">مشاهده کتابخانه و فروشگاه</a>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="flex items-center justify-between p-space-sm rounded-2xl bg-surface-container-low border border-outline-variant/30">
        <div class="flex items-center gap-3">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" class="w-12 h-16 object-cover rounded-lg shadow-sm" />` : ''}
          <div class="flex flex-col text-right">
            <span class="font-label-md text-label-md font-bold text-on-surface line-clamp-1">${item.title}</span>
            <span class="font-body-sm text-body-sm text-outline mt-0.5">
              ${item.quantity.toLocaleString('fa-IR')} نسخه • ${(item.price * item.quantity).toLocaleString('fa-IR')} تومان
            </span>
            <div class="flex items-center gap-2 mt-1">
              <button onclick="updateCartQuantity('${item.title}', 1)" class="w-5 h-5 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface transition-colors">+</button>
              <span class="font-label-sm text-xs font-semibold px-1">${item.quantity.toLocaleString('fa-IR')}</span>
              <button onclick="updateCartQuantity('${item.title}', -1)" class="w-5 h-5 rounded-full bg-surface-container-high hover:bg-surface-container-highest flex items-center justify-center text-xs font-bold text-on-surface transition-colors">-</button>
            </div>
          </div>
        </div>
        <button onclick="removeFromCart('${item.title}')" class="p-1 rounded-full text-outline hover:text-error hover:bg-surface-container-high transition-colors" title="حذف از سبد">
          <span class="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    `).join('');
  }
}

// ==========================================
// 2. TELEGRAM ORDERING ENGINE
// ==========================================
function sendOrderToTelegram() {
  const items = getCartItems();
  if (items.length === 0) {
    showToast('سبد خرید شما در حال حاضر خالی است.');
    return;
  }

  let totalSum = 0;
  let itemsText = '';
  items.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalSum += itemTotal;
    itemsText += `${index + 1}. ${item.title} (${item.quantity.toLocaleString('fa-IR')} جلد) - ${itemTotal.toLocaleString('fa-IR')} تومان\n`;
  });

  const message = 
`سلام و درود به تیم زینو لایف 🌻
مایلم سفارش زیر را از طریق ربات رسمی ثبت کنم:

📦 اقلام سفارش:
${itemsText}
💰 مبلغ کل قابل پرداخت: ${totalSum.toLocaleString('fa-IR')} تومان

لطفاً راهنمایی بفرمایید تا پرداخت و ارسال را تکمیل کنم. سپاس!`;

  const botUrl = `https://t.me/Zinoolifestorebot?text=${encodeURIComponent(message)}`;
  
  // Try opening Telegram
  window.open(botUrl, '_blank');
  showToast('در حال انتقال به ربات تلگرام زینو لایف...');
}

// Direct Telegram Order for a single item
function orderSingleProductTelegram(title, price) {
  const message = 
`سلام! قصد خرید مستقیم کتاب زیر را از زینو لایف دارم:
📖 عنوان: ${title}
💰 قیمت: ${price.toLocaleString('fa-IR')} تومان

لطفاً مراحل ارسال فاکتور و ثبت سفارش را بفرمایید.`;

  const botUrl = `https://t.me/Zinoolifestorebot?text=${encodeURIComponent(message)}`;
  window.open(botUrl, '_blank');
  showToast('در حال اتصال به ربات تلگرام...');
}

// ==========================================
// 3. TOAST NOTIFICATION HELPER
// ==========================================
function showToast(message) {
  let toast = document.getElementById('toast-notify');
  let toastText = document.getElementById('toast-text');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notify';
    toast.className = 'fixed bottom-6 right-6 z-[999] bg-primary text-on-primary px-space-lg py-space-sm rounded-full shadow-2xl flex items-center gap-space-xs transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-green-400 text-[20px]">check_circle</span>
      <span class="font-label-md text-label-md" id="toast-text">${message}</span>
    `;
    document.body.appendChild(toast);
    toastText = document.getElementById('toast-text');
  }

  if (toast && toastText) {
    toastText.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3200);
  }
}

// ==========================================
// 4. AMBIENT AUDIO SYNTHESIZER & PLAYER
// ==========================================
let audioContext = null;
let ambientOsc1 = null;
let ambientOsc2 = null;
let ambientGain = null;
let isAmbientPlaying = false;
let audioScrubInterval = null;
let currentSeconds = 8 * 60 + 42; // 08:42 default
const totalSeconds = 42 * 60 + 15; // 42:15 default

function initAmbientSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = new AudioCtx();

    ambientGain = audioContext.createGain();
    ambientGain.gain.setValueAtTime(0.06, audioContext.currentTime);

    // Warm relaxing chord: 216Hz and 432Hz harmonic
    ambientOsc1 = audioContext.createOscillator();
    ambientOsc1.type = 'sine';
    ambientOsc1.frequency.setValueAtTime(216, audioContext.currentTime);

    ambientOsc2 = audioContext.createOscillator();
    ambientOsc2.type = 'triangle';
    ambientOsc2.frequency.setValueAtTime(432, audioContext.currentTime);

    ambientOsc1.connect(ambientGain);
    ambientOsc2.connect(ambientGain);
    ambientGain.connect(audioContext.destination);

    ambientOsc1.start();
    ambientOsc2.start();
    isAmbientPlaying = true;
  } catch (e) {
    console.warn('Audio Context not available or permitted yet', e);
  }
}

function toggleAudioPlayback() {
  const mainPlayBtn = document.getElementById('main-play-btn');
  const mainPlayIcon = document.getElementById('main-play-icon');

  if (!audioContext) {
    initAmbientSound();
    if (mainPlayIcon) mainPlayIcon.textContent = 'pause';
    showToast('پخش اپیزود تحلیلی زینو لایف آغاز شد.');
    startAudioScrubTimer();
    return;
  }

  if (audioContext.state === 'suspended') {
    audioContext.resume();
    isAmbientPlaying = true;
    if (mainPlayIcon) mainPlayIcon.textContent = 'pause';
    showToast('پخش ادامه یافت.');
    startAudioScrubTimer();
  } else if (audioContext.state === 'running') {
    audioContext.suspend();
    isAmbientPlaying = false;
    if (mainPlayIcon) mainPlayIcon.textContent = 'play_arrow';
    showToast('پخش متوقف شد.');
    clearInterval(audioScrubInterval);
  }
}

function startAudioScrubTimer() {
  clearInterval(audioScrubInterval);
  audioScrubInterval = setInterval(() => {
    if (isAmbientPlaying) {
      currentSeconds += 1;
      if (currentSeconds >= totalSeconds) {
        currentSeconds = 0;
      }
      updateScrubberUI();
    }
  }, 1000);
}

function formatTimePersian(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  const mm = m < 10 ? '۰' + m.toLocaleString('fa-IR') : m.toLocaleString('fa-IR');
  const ss = s < 10 ? '۰' + s.toLocaleString('fa-IR') : s.toLocaleString('fa-IR');
  return `${mm}:${ss}`;
}

function updateScrubberUI() {
  const currentEl = document.getElementById('audio-current-time');
  const barEl = document.getElementById('audio-progress-bar');
  if (currentEl) {
    currentEl.textContent = formatTimePersian(currentSeconds);
  }
  if (barEl) {
    const pct = (currentSeconds / totalSeconds) * 100;
    barEl.style.width = `${pct}%`;
  }
}

// ==========================================
// 5. MOBILE NAVIGATION CONTROLLER
// ==========================================
function toggleMobileMenu(open) {
  const menu = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-backdrop');
  if (menu) {
    if (open) {
      menu.classList.remove('translate-x-full');
      if (overlay) overlay.classList.remove('hidden');
    } else {
      menu.classList.add('translate-x-full');
      if (overlay) overlay.classList.add('hidden');
    }
  }
}

// ==========================================
// 6. DOM READY INITIALIZER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  // Attach Cart Drawer openers
  document.querySelectorAll('[data-path="cart"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleCartDrawer(true);
    });
  });

  // Attach Audio Player play button if exists
  const mainPlayBtn = document.getElementById('main-play-btn');
  if (mainPlayBtn) {
    mainPlayBtn.addEventListener('click', () => {
      toggleAudioPlayback();
    });
  }

  // Audio speed buttons
  const speedBtns = document.querySelectorAll('.speed-btn');
  speedBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speedBtns.forEach(b => {
        b.classList.remove('bg-secondary', 'text-white');
        b.classList.add('text-primary-fixed-dim');
      });
      btn.classList.add('bg-secondary', 'text-white');
      btn.classList.remove('text-primary-fixed-dim');
      showToast(`سرعت پخش به ${btn.textContent} تغییر یافت.`);
    });
  });

  // Favorite button
  const favBtn = document.getElementById('audio-fav-btn');
  if (favBtn) {
    favBtn.addEventListener('click', () => {
      favBtn.classList.toggle('text-rose-400');
      showToast('اپیزود به نشان‌شده‌های شما افزوده شد.');
    });
  }

  // Share button
  const shareBtn = document.getElementById('audio-share-btn');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'پادکست زینو لایف',
          text: 'اپیزود ۲۴: چگونه از تله کمال‌گرایی منفی رها شویم؟',
          url: window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        showToast('لینک اپیزود در کلیپ‌بورد کپی شد.');
      }
    });
  }

  // Search input handler
  const searchInputs = document.querySelectorAll('.global-search-input');
  searchInputs.forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          window.location.href = `products.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  });

  // Accordion triggers for FAQ
  document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.closest('.faq-item');
      const content = parent.querySelector('.faq-content');
      const icon = btn.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close other open faqs
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach(i => i.style.transform = 'rotate(0deg)');

      if (!isOpen) {
        content.classList.remove('hidden');
        if (icon) icon.style.transform = 'rotate(180deg)';
      }
    });
  });
});
