// Shopping Cart Functionality
let cart = [];
let cartCount = 0;

// Subject data for each grade
const gradeSubjects = {
    'preschool': ['Life Skills', 'English', 'Mathematics', 'Creative Arts'],
    'reception': ['Life Skills', 'English', 'Mathematics', 'Creative Arts', 'Afrikaans'],
    'grade1': ['Home Language', 'First Additional Language', 'Mathematics', 'Life Skills'],
    'grade2': ['Home Language', 'First Additional Language', 'Mathematics', 'Life Skills'],
    'grade3': ['Home Language', 'First Additional Language', 'Mathematics', 'Life Skills'],
    'grade4': ['Home Language', 'First Additional Language', 'Mathematics', 'Natural Sciences', 'Social Sciences', 'Life Skills'],
    'grade5': ['Home Language', 'First Additional Language', 'Mathematics', 'Natural Sciences', 'Social Sciences', 'Life Skills'],
    'grade6': ['Home Language', 'First Additional Language', 'Mathematics', 'Natural Sciences', 'Social Sciences', 'Life Skills'],
    'grade7': ['Home Language', 'First Additional Language', 'Mathematics', 'Natural Sciences', 'Social Sciences', 'Technology', 'Creative Arts'],
    'grade8': ['Home Language', 'First Additional Language', 'Mathematics', 'Natural Sciences', 'Social Sciences', 'Technology', 'Creative Arts', 'Economic Management Sciences'],
    'grade9': ['Home Language', 'First Additional Language', 'Mathematics', 'Natural Sciences', 'Social Sciences', 'Technology', 'Creative Arts', 'Economic Management Sciences'],
    'grade10': ['English', 'Afrikaans', 'Mathematics', 'Mathematical Literacy', 'Physical Sciences', 'Life Sciences', 'Accounting', 'Business Studies', 'Economics', 'Geography', 'History', 'Life Orientation'],
    'grade11': ['English', 'Afrikaans', 'Mathematics', 'Mathematical Literacy', 'Physical Sciences', 'Life Sciences', 'Accounting', 'Business Studies', 'Economics', 'Geography', 'History', 'Life Orientation'],
    'grade12': ['English', 'Afrikaans', 'Mathematics', 'Mathematical Literacy', 'Physical Sciences', 'Life Sciences', 'Accounting', 'Business Studies', 'Economics', 'Geography', 'History', 'Life Orientation']
};

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

// Show subjects for a grade
function showSubjects(grade, gradeName) {
    const subjects = gradeSubjects[grade];
    if (!subjects) return;
    
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'subjects-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">&times;</button>
            <h2 class="modal-title">${gradeName} - Select a Subject</h2>
            <div class="subjects-grid">
                ${subjects.map(subject => `
                    <div class="subject-card">
                        <div class="subject-icon">📚</div>
                        <h3>${subject}</h3>
                        <p>Click here for ${subject} Resources</p>
                        <button class="btn-subject" onclick="viewSubject('${grade}', '${subject}')">View Resources</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => document.body.removeChild(modal), 300);
    });
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => document.body.removeChild(modal), 300);
        }
    });
}

// View subject resources
function viewSubject(grade, subject) {
    showNotification(`Loading ${subject} resources for ${grade}...`);
    // Here you would load the actual resources
    console.log(`Loading resources for ${grade} - ${subject}`);
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
        const gradeName = gradeBtn.closest('.grade-card').querySelector('h3').textContent;
        const gradeClass = gradeBtn.closest('.grade-card').classList;
        let grade = '';
        
        // Extract grade identifier from class list
        gradeClass.forEach(className => {
            if (gradeSubjects[className]) {
                grade = className;
            }
        });
        
        if (grade) {
            showSubjects(grade, gradeName);
        } else {
            showNotification(`Loading ${gradeName} resources...`);
        }
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
