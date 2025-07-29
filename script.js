// DOM Elements
const hamburger = document.getElementById('hamburger');
const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const modalClose = document.getElementById('modalClose');
const loginForm = document.getElementById('loginForm');
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotClose = document.getElementById('chatbotClose');
const chatbotWidget = document.querySelector('.chatbot-widget');
const chatbotBody = document.getElementById('chatbotBody');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotSend = document.getElementById('chatbotSend');
const accordionBtns = document.querySelectorAll('.accordion-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
const productSlider = document.querySelector('.product-slider');
const productsGrid = document.getElementById('productsGrid');
const newsletterForm = document.getElementById('newsletterForm');
const featuredProductLink = document.getElementById('featuredProductLink');

// Products Data
let products = [];
let clickStats = {};

// Initialize Swiper
let productSwiper;

// Initialize Click Stats
function initClickStats() {
    const savedStats = localStorage.getItem('merakitzamClickStats');
    if (savedStats) {
        clickStats = JSON.parse(savedStats);
    } else {
        // Initialize with some default values
        clickStats = {
            totalClicks: 0,
            productClicks: {},
            featuredProductClicks: 0,
            newsletterSignups: 0
        };
        saveClickStats();
    }
}

// Save Click Stats to LocalStorage
function saveClickStats() {
    localStorage.setItem('merakitzamClickStats', JSON.stringify(clickStats));
    updateStatsDisplay();
}

// Update Stats Display
function updateStatsDisplay() {
    document.getElementById('productCount').textContent = products.length + '+';
    document.getElementById('customerCount').textContent = Math.floor(clickStats.totalClicks / 3) + '+';
    document.getElementById('downloadCount').textContent = clickStats.totalClicks * 5 + '+';
}

// Track Click
function trackClick(elementId) {
    if (!clickStats.productClicks[elementId]) {
        clickStats.productClicks[elementId] = 0;
    }
    clickStats.productClicks[elementId]++;
    clickStats.totalClicks++;
    saveClickStats();
}

// Load Products from JSON
async function loadProducts() {
    try {
        const response = await fetch('data/products.json');
        products = await response.json();
        renderProducts();
        initProductSlider();
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Render Products
function renderProducts(filterCategory = 'all') {
    productsGrid.innerHTML = '';
    
    const filteredProducts = filterCategory === 'all' 
        ? products 
        : products.filter(product => product.category === filterCategory);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-content">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-price">
                    <span class="product-price-current">Rp ${product.price.toLocaleString('id-ID')}</span>
                    ${product.oldPrice ? `<span class="product-price-old">Rp ${product.oldPrice.toLocaleString('id-ID')}</span>` : ''}
                </div>
                <div class="product-rating">
                    <div class="product-rating-stars">
                        ${'<i class="fas fa-star"></i>'.repeat(Math.floor(product.rating))}
                        ${product.rating % 1 >= 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    </div>
                    <span class="product-rating-count">(${product.reviews})</span>
                </div>
                <div class="product-cta">
                    <a href="${product.link}" class="btn-primary" onclick="trackClick('${product.id}')">Detail Produk</a>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Initialize Product Slider
function initProductSlider() {
    // Clear previous slider if exists
    if (productSwiper) {
        productSwiper.destroy();
    }
    
    const sliderWrapper = document.getElementById('productSlider');
    sliderWrapper.innerHTML = '';
    
    // Get featured products (first 5 for demo)
    const featuredProducts = products.slice(0, 5);
    
    featuredProducts.forEach(product => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-content">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-price">
                        <span class="product-price-current">Rp ${product.price.toLocaleString('id-ID')}</span>
                        ${product.oldPrice ? `<span class="product-price-old">Rp ${product.oldPrice.toLocaleString('id-ID')}</span>` : ''}
                    </div>
                    <div class="product-cta">
                        <a href="${product.link}" class="btn-primary" onclick="trackClick('${product.id}')">Detail Produk</a>
                    </div>
                </div>
            </div>
        `;
        sliderWrapper.appendChild(slide);
    });
    
    // Initialize Swiper
    productSwiper = new Swiper('.product-slider', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            992: {
                slidesPerView: 3,
            }
        }
    });
}

// Chatbot Responses
const chatbotResponses = {
    'produk': 'Kami memiliki berbagai produk digital kreatif seperti template, tool, bundle, dan course. Produk unggulan kami saat ini adalah "Paket Ultimate Digital Creator". Anda bisa melihat semua produk di bagian "Produk" di atas.',
    'harga': 'Harga produk kami bervariasi mulai dari Rp 50.000 hingga Rp 1.500.000 tergantung jenis dan kompleksitas produk. Saat ini ada diskon spesial untuk "Paket Ultimate Digital Creator" dari Rp 1.500.000 menjadi Rp 899.000 (40% OFF).',
    'diskon': 'Kami sering memberikan diskon khusus untuk produk tertentu. Saat ini ada diskon 40% untuk "Paket Ultimate Digital Creator". Juga ada diskon untuk pembelian bundle atau pembelian dalam jumlah banyak. Hubungi kami untuk info lebih lanjut.',
    'pembayaran': 'Pembayaran bisa dilakukan melalui Lynk.id yang mendukung berbagai metode pembayaran seperti transfer bank, e-wallet (OVO, GoPay, Dana), dan kartu kredit.',
    'garansi': 'Kami menawarkan garansi uang kembali 7 hari jika produk tidak sesuai deskripsi. Untuk update produk, sebagian besar produk kami mendapatkan update gratis selama 1 tahun.',
    'default': 'Maaf, saya tidak mengerti pertanyaan Anda. Berikut beberapa hal yang bisa saya bantu: produk, harga, diskon, pembayaran, garansi. Silakan tanyakan salah satu topik ini.'
};

// Send Chatbot Message
function sendChatbotMessage(message, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chatbot-message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatbotBody.appendChild(messageDiv);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
}

// Handle Chatbot Input
function handleChatbotInput() {
    const message = chatbotInput.value.trim();
    if (message === '') return;
    
    // Add user message
    sendChatbotMessage(message, true);
    chatbotInput.value = '';
    
    // Simple response logic
    let response = '';
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('produk') || lowerMessage.includes('barang') || lowerMessage.includes('item')) {
        response = chatbotResponses['produk'];
    } else if (lowerMessage.includes('harga') || lowerMessage.includes('price') || lowerMessage.includes('biaya')) {
        response = chatbotResponses['harga'];
    } else if (lowerMessage.includes('diskon') || lowerMessage.includes('promo') || lowerMessage.includes('sale')) {
        response = chatbotResponses['diskon'];
    } else if (lowerMessage.includes('pembayaran') || lowerMessage.includes('bayar') || lowerMessage.includes('payment')) {
        response = chatbotResponses['pembayaran'];
    } else if (lowerMessage.includes('garansi') || lowerMessage.includes('return') || lowerMessage.includes('refund')) {
        response = chatbotResponses['garansi'];
    } else {
        response = chatbotResponses['default'];
    }
    
    // Simulate typing delay
    setTimeout(() => {
        sendChatbotMessage(response);
    }, 800);
}

// Event Listeners
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
});

// Close mobile menu when clicking a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        nav.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Login Modal
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.add('active');
});

modalClose.addEventListener('click', () => {
    loginModal.classList.remove('active');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Simple validation (in a real app, this would be a server-side check)
    if (username === 'admin' && password === 'merakitzam123') {
        alert('Login berhasil! (Ini hanya demo)');
        loginModal.classList.remove('active');
    } else {
        alert('Username atau password salah!');
    }
});

// Chatbot Toggle
chatbotToggle.addEventListener('click', () => {
    chatbotWidget.classList.toggle('active');
});

chatbotClose.addEventListener('click', () => {
    chatbotWidget.classList.remove('active');
});

chatbotSend.addEventListener('click', handleChatbotInput);

chatbotInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleChatbotInput();
    }
});

// Accordion
accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
    });
});

// Product Category Filter
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.category;
        renderProducts(category);
    });
});

// Newsletter Form
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input').value;
    
    // Simple validation
    if (email.includes('@') && email.includes('.')) {
        alert('Terima kasih telah berlangganan newsletter kami!');
        newsletterForm.querySelector('input').value = '';
        
        // Track newsletter signup
        clickStats.newsletterSignups++;
        clickStats.totalClicks++;
        saveClickStats();
    } else {
        alert('Masukkan alamat email yang valid!');
    }
});

// Track featured product click
featuredProductLink.addEventListener('click', () => {
    clickStats.featuredProductClicks++;
    clickStats.totalClicks++;
    saveClickStats();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initClickStats();
    loadProducts();
    
    // Initialize review slider
    new Swiper('.review-slider', {
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            }
        }
    });
    
    // Send welcome message after a delay
    setTimeout(() => {
        sendChatbotMessage('Halo lagi! Ada yang bisa saya bantu? Ketik "produk", "harga", "diskon", "pembayaran", atau "garansi" untuk informasi lebih lanjut.');
    }, 2000);
});

// Make trackClick available globally
window.trackClick = trackClick;
