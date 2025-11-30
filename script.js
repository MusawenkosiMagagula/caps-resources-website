// Shopping Cart Functionality
let cart = [];
let cartCount = 0;

// Update cart count display
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Add to cart functionality
function addToCart(item) {
    cart.push(item);
    cartCount++;
    updateCartCount();
    showNotification('Added to cart!');
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Grade card button click handlers
document.querySelectorAll('.btn-grade').forEach(button => {
    button.addEventListener('click', function(e) {
        const gradeCard = this.closest('.grade-card');
        const gradeName = gradeCard.querySelector('.grade-header h3').textContent;
        
        // In a real application, this would navigate to the grade-specific page
        showNotification(`Loading ${gradeName} resources...`);
        
        // Simulate loading delay
        setTimeout(() => {
            // Here you would typically navigate to a grade-specific page
            console.log(`Navigating to ${gradeName} resources page`);
        }, 1000);
    });
});

// Cart button click handler
document.querySelector('.cart-btn').addEventListener('click', function() {
    if (cartCount === 0) {
        showNotification('Your cart is empty');
    } else {
        showNotification(`You have ${cartCount} item(s) in your cart`);
        // In a real application, this would open the cart modal or navigate to cart page
    }
});

// Sign in button click handler
document.querySelector('.btn-primary').addEventListener('click', function() {
    showNotification('Sign in feature coming soon!');
    // In a real application, this would open a sign-in modal
});

// Browse all resources buttons
document.querySelectorAll('.btn-large').forEach(button => {
    button.addEventListener('click', function() {
        const gradesSection = document.querySelector('#grades');
        if (gradesSection) {
            gradesSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe grade cards and feature cards
document.querySelectorAll('.grade-card, .feature-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialize cart count on page load
updateCartCount();

console.log('CAPS Resources Store loaded successfully!');
