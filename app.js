// 1. PRODUCT CATALOG DATA (Hunter 350 Specific Hard Shell Fiber Covers)
const PRODUCTS = [
  {
    id: 'prod-samurai',
    name: 'Midnight Samurai Cover',
    price: 4499,
    originalPrice: 5999,
    category: 'classic',
    image: 'images/tank-samurai.png?v=7',
    badge: 'BESTSELLER'
  },
  {
    id: 'prod-marlboro',
    name: 'Marlboro Red Racer',
    price: 4499,
    originalPrice: 5999,
    category: 'racing',
    image: 'images/tank-marlboro.png?v=7',
    badge: 'NEW'
  },
  {
    id: 'prod-redbull',
    name: 'Oracle Bull Cover',
    price: 4499,
    originalPrice: 5999,
    category: 'racing',
    image: 'images/tank-redbull.png?v=7',
    badge: 'BESTSELLER'
  },
  {
    id: 'prod-batman',
    name: 'Dark Knight Cover',
    price: 4499,
    originalPrice: 5999,
    category: 'superheroes',
    image: 'images/tank-batman.png?v=7',
    badge: 'BESTSELLER'
  },
  {
    id: 'prod-superman',
    name: 'Man of Steel Cover',
    price: 4499,
    originalPrice: 5999,
    category: 'superheroes',
    image: 'images/tank-superman.png?v=7',
    badge: 'NEW'
  },
  {
    id: 'prod-goldstripe',
    name: 'Classic Gold Pinstripe',
    price: 4499,
    originalPrice: 5999,
    category: 'classic',
    image: 'images/tank-goldstripe.png?v=7',
    badge: ''
  },
  {
    id: 'prod-stealth',
    name: 'Stealth Matte Black',
    price: 4499,
    originalPrice: 5999,
    category: 'classic',
    image: 'images/tank-stealth.png?v=7',
    badge: 'STEALTH'
  },
  {
    id: 'prod-ronin',
    name: 'Deep Ocean Samurai',
    price: 4499,
    originalPrice: 5999,
    category: 'classic',
    image: 'images/tank-ronin.png?v=7',
    badge: 'LIMITED'
  }
];

// 2. STATE MANAGEMENT
let cart = [];
let activeFilter = 'all';

// DOM ELEMENTS
const cartBtn = document.querySelector('.cart-btn');
const cartCount = document.querySelector('.cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const cartClose = document.getElementById('cart-close');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsList = document.getElementById('cart-items-list');
const cartDrawerFooter = document.getElementById('cart-drawer-footer');
const cartSubtotalVal = document.querySelector('.cart-subtotal-val');
const productsContainer = document.getElementById('products-container');
const filterChips = document.querySelectorAll('.filter-chip');
const collectionCards = document.querySelectorAll('.collection-card');
const heroExploreBtn = document.getElementById('hero-explore-btn');

// Checkout DOM Elements
const checkoutModal = document.getElementById('checkout-modal');
const checkoutTriggerBtn = document.getElementById('checkout-trigger-btn');
const checkoutCloseBtn = document.getElementById('checkout-close');
const checkoutOverlayClose = document.getElementById('checkout-overlay-close');
const checkoutForm = document.getElementById('checkout-shipping-form');
const checkoutSummaryList = document.getElementById('checkout-summary-list');
const checkoutTotalVals = document.querySelectorAll('.checkout-total-val');
const orderSuccessView = document.getElementById('order-success-view');
const successDoneBtn = document.getElementById('success-done-btn');

// Initialize Lucide Icons
function initIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// 3. CART ACTIONS
function toggleCart(open = null) {
  const isOpen = cartDrawer.classList.contains('active');
  const shouldOpen = open !== null ? open : !isOpen;
  
  if (shouldOpen) {
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevents background scroll
  } else {
    cartDrawer.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function updateCartUI() {
  // Count items
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalItems;
  
  // Quick bounce feedback
  cartCount.classList.remove('bounce');
  void cartCount.offsetWidth; // Trigger reflow
  cartCount.classList.add('bounce');
  
  if (cart.length === 0) {
    cartDrawer.classList.remove('has-items');
    cartItemsList.innerHTML = `
      <div class="cart-empty-state">
        <i data-lucide="shopping-bag" style="width:48px;height:48px;color:var(--text-muted);"></i>
        <p>Your cart is empty</p>
        <button class="btn btn-primary btn-shop-now" id="cart-empty-shop">Shop Now</button>
      </div>
    `;
    const emptyShopBtn = document.getElementById('cart-empty-shop');
    if (emptyShopBtn) {
      emptyShopBtn.addEventListener('click', () => {
        toggleCart(false);
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
      });
    }
  } else {
    cartDrawer.classList.add('has-items');
    
    // Render list
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
      const itemSub = item.product.price * item.qty;
      subtotal += itemSub;
      
      html += `
        <div class="cart-item" data-id="${item.product.id}">
          <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-img">
          <div class="cart-item-details">
            <h4 class="cart-item-name">${item.product.name}</h4>
            <div class="cart-item-price">₹${item.product.price.toLocaleString('en-IN')}</div>
            <div class="cart-item-qty-row">
              <div class="cart-qty-selectors">
                <button class="cart-qty-btn decrease" data-id="${item.product.id}">-</button>
                <span class="cart-qty-val">${item.qty}</span>
                <button class="cart-qty-btn increase" data-id="${item.product.id}">+</button>
              </div>
              <button class="cart-remove-btn" data-id="${item.product.id}">Remove</button>
            </div>
          </div>
        </div>
      `;
    });
    
    cartItemsList.innerHTML = html;
    cartSubtotalVal.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    
    // Update Checkout form total labels too
    checkoutTotalVals.forEach(el => {
      el.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    });
  }
  
  initIcons();
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find(item => item.product.id === productId);
  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ product, qty: 1 });
  }
  
  updateCartUI();
  toggleCart(true);
}

function adjustQty(productId, amount) {
  const itemIndex = cart.findIndex(item => item.product.id === productId);
  if (itemIndex === -1) return;
  
  cart[itemIndex].qty += amount;
  if (cart[itemIndex].qty <= 0) {
    cart.splice(itemIndex, 1);
  }
  
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.product.id !== productId);
  updateCartUI();
}

// 4. RENDERING PRODUCTS WITH SHIMMER SKELETON LOADER
function renderProducts(filter = 'all') {
  productsContainer.innerHTML = '';
  
  // Create Skeleton shimmers
  for (let i = 0; i < 4; i++) {
    const skeleton = document.createElement('div');
    skeleton.className = 'product-card';
    skeleton.innerHTML = `
      <div class="skeleton-wrapper"></div>
      <div class="skeleton-text"></div>
      <div class="skeleton-text short"></div>
    `;
    productsContainer.appendChild(skeleton);
  }
  
  // Wait 400ms to simulate dynamic premium rendering and load effects
  setTimeout(() => {
    productsContainer.innerHTML = '';
    
    const filtered = filter === 'all' 
      ? PRODUCTS 
      : PRODUCTS.filter(p => p.category === filter);
      
    if (filtered.length === 0) {
      productsContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 48px 0; color: var(--text-secondary);">
          <i data-lucide="info" style="width:48px;height:48px;color:var(--text-muted);margin-bottom:12px;"></i>
          <p>No products found in this category.</p>
        </div>
      `;
      initIcons();
      return;
    }
    
    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.setAttribute('data-id', p.id);
      
      const badgeHtml = p.badge 
        ? `<div class="product-badge">${p.badge}</div>` 
        : '';
        
      card.innerHTML = `
        <div class="product-image-wrapper">
          ${badgeHtml}
          <img src="${p.image}" alt="${p.name}" class="product-img">
        </div>
        <div class="product-details">
          <div class="product-info-left">
            <h3 class="product-name">${p.name}</h3>
            <div class="product-price-row">
              <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
              <span class="product-original-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button class="btn-quick-add" data-id="${p.id}" aria-label="Add to cart">
            <i data-lucide="plus"></i>
          </button>
        </div>
      `;
      productsContainer.appendChild(card);
    });
    
    initIcons();
  }, 400);
}

// 5. BEFORE/AFTER INTERACTIVE SLIDER
function initBeforeAfterSlider() {
  const container = document.querySelector('.before-after-container');
  const handle = document.querySelector('.slider-handle');
  
  if (!container || !handle) return;
  
  let isDragging = false;
  
  function updateSlider(clientX) {
    const rect = container.getBoundingClientRect();
    let percentage = ((clientX - rect.left) / rect.width) * 100;
    
    // Constraints
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    
    // Set custom property for CSS clip-path inset
    container.style.setProperty('--slide-pos', `${percentage}%`);
  }
  
  // Drag functions
  function onStart(e) {
    e.preventDefault(); // Prevents browser image ghost-dragging blockages
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  }
  
  function onMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  }
  
  function onEnd() {
    isDragging = false;
  }
  
  // Bind touch & mouse events directly to container for drag flexibility
  container.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  
  container.addEventListener('touchstart', onStart);
  window.addEventListener('touchmove', onMove);
  window.addEventListener('touchend', onEnd);
}

// 6. CHECKOUT FORM DRAWER MODAL CONTROL
function toggleCheckout(open) {
  if (open) {
    // Populate order summary items
    let summaryHtml = '';
    let subtotal = 0;
    
    cart.forEach(item => {
      summaryHtml += `
        <div class="summary-item-row">
          <span>${item.product.name} (x${item.qty})</span>
          <strong>₹${(item.product.price * item.qty).toLocaleString('en-IN')}</strong>
        </div>
      `;
      subtotal += item.product.price * item.qty;
    });
    
    checkoutSummaryList.innerHTML = summaryHtml;
    
    checkoutTotalVals.forEach(el => {
      el.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    });
    
    checkoutModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    checkoutModal.classList.remove('active');
    // Restore overflow if cart drawer isn't active
    if (!cartDrawer.classList.contains('active')) {
      document.body.style.overflow = '';
    }
  }
}

// 7. ENTRANCE ANIMATIONS (Intersection Observer)
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
  });
}

// 8. EVENT BINDINGS
function initEventBindings() {
  // Cart Drawer open/close
  cartBtn.addEventListener('click', () => toggleCart(true));
  cartClose.addEventListener('click', () => toggleCart(false));
  cartOverlay.addEventListener('click', () => toggleCart(false));
  
  // Delegate clicks on cart drawer (quantity update, remove item)
  cartItemsList.addEventListener('click', (e) => {
    const target = e.target;
    
    if (target.classList.contains('cart-qty-btn')) {
      const id = target.getAttribute('data-id');
      const change = target.classList.contains('increase') ? 1 : -1;
      adjustQty(id, change);
    }
    
    if (target.classList.contains('cart-remove-btn')) {
      const id = target.getAttribute('data-id');
      removeFromCart(id);
    }
  });
  
  // Shop section: filter chips
  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      
      const filter = chip.getAttribute('data-filter');
      renderProducts(filter);
    });
  });

  // Featured collections: quick category filter click links
  collectionCards.forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category').toLowerCase();
      
      // Update active chip
      filterChips.forEach(c => {
        const chipFilter = c.getAttribute('data-filter');
        c.classList.toggle('active', chipFilter === cat);
      });
      
      // Scroll to shop section
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
      
      // Render
      renderProducts(cat);
    });
  });
  
  // Delegate product catalog Quick Add button clicks
  productsContainer.addEventListener('click', (e) => {
    const quickAddBtn = e.target.closest('.btn-quick-add');
    if (quickAddBtn) {
      const id = quickAddBtn.getAttribute('data-id');
      addToCart(id);
    }
  });

  // Hero Explore Button
  heroExploreBtn.addEventListener('click', () => {
    document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
  });
  
  // Tap effect scaling on explore collections
  document.querySelectorAll('.view-all-link, .learn-more-link').forEach(link => {
    link.addEventListener('click', () => {
      link.style.transform = 'scale(0.97)';
      setTimeout(() => {
        link.style.transform = '';
      }, 100);
    });
  });

  // Checkout Actions
  checkoutTriggerBtn.addEventListener('click', () => {
    toggleCart(false); // Close cart drawer
    toggleCheckout(true); // Open checkout modal
  });
  
  checkoutCloseBtn.addEventListener('click', () => toggleCheckout(false));
  checkoutOverlayClose.addEventListener('click', () => toggleCheckout(false));
  
  // Checkout Form Submission (Mocking Order Placement)
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Animate Success Screen
    orderSuccessView.classList.add('active');
    
    // Clear Cart State
    cart = [];
    updateCartUI();
  });
  
  // Close success window and restore view
  successDoneBtn.addEventListener('click', () => {
    orderSuccessView.classList.remove('active');
    toggleCheckout(false);
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// 9. ON DOM LOAD INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initIcons();
  renderProducts('all');
  initBeforeAfterSlider();
  initScrollReveal();
  initEventBindings();
  updateCartUI(); // Reset visual state
});
