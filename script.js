// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// Initialize Three.js scene only if the container exists
const globeContainer = document.getElementById('globe-container');
if (globeContainer) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, globeContainer.clientWidth / globeContainer.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    globeContainer.appendChild(renderer.domElement);
    
    // Create a simple sphere
    const geometry = new THREE.SphereGeometry(5, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: 0x0A192F,
        emissive: 0x112240,
        specular: 0x666666,
        shininess: 10
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
    
    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 3, 5);
    scene.add(light);
    
    camera.position.z = 10;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.005;
        renderer.render(scene, camera);
    }
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight);
    });
}

// Initialize Google Maps only if the container exists
function initMap() {
    const mapElement = document.getElementById('map');
    if (mapElement) {
        try {
            const map = new google.maps.Map(mapElement, {
                zoom: 12,
                center: { lat: -34.397, lng: 150.644 },
                styles: [
                    {
                        "elementType": "geometry",
                        "stylers": [{"color": "#0A192F"}]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [{"color": "#746855"}]
                    }
                    // Add more custom styles as needed
                ]
            });

            // Add a marker
            const marker = new google.maps.marker.AdvancedMarkerElement({
                position: { lat: -34.397, lng: 150.644 },
                map: map,
                title: "Location"
            });
        } catch (error) {
            console.warn('Error initializing Google Maps:', error);
            mapElement.innerHTML = '<p>Map temporarily unavailable</p>';
        }
    }
}

// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.dataset.theme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
        themeToggle.setAttribute('aria-checked', document.body.dataset.theme === 'light');
    });
}

// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', hamburger.classList.contains('active'));
    });
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && hamburger && !navLinks.contains(e.target) && !hamburger.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
    }
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');
const successMessage = document.querySelector('.success-message');
const errorMessage = document.querySelector('.error-message');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            formStatus.hidden = false;
            successMessage.hidden = false;
            errorMessage.hidden = true;

            // Reset form
            contactForm.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                formStatus.hidden = true;
                successMessage.hidden = true;
            }, 5000);

        } catch (error) {
            // Show error message
            formStatus.hidden = false;
            successMessage.hidden = true;
            errorMessage.hidden = false;

            // Hide error message after 5 seconds
            setTimeout(() => {
                formStatus.hidden = true;
                errorMessage.hidden = true;
            }, 5000);
        }

        // Reset button state
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    });
}

// Animate info items on scroll
const infoItems = document.querySelectorAll('.info-item');
if (infoItems.length) {
    const animateInfoItems = () => {
        infoItems.forEach((item, index) => {
            if (isElementInViewport(item)) {
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    };

    // Initial styles
    infoItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'all 0.5s ease';
    });

    // Animate on scroll
    window.addEventListener('scroll', animateInfoItems);
    // Initial check
    animateInfoItems();
}

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Form input animations
const formInputs = document.querySelectorAll('.form-input');
formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });
});

// Enhanced Project Card Animations
document.addEventListener('DOMContentLoaded', function() {
    const projectGrid = document.querySelector('.project-grid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!projectGrid) {
        console.warn('Project grid not found');
        return;
    }

    // Set initial active state for "All Projects" button
    const allProjectsBtn = document.querySelector('.filter-btn[data-category="all"]');
    if (allProjectsBtn) {
        allProjectsBtn.classList.add('active');
        allProjectsBtn.setAttribute('aria-pressed', 'true');
    }

    // Initialize Isotope
    let iso = new Isotope(projectGrid, {
        itemSelector: '.project-card',
        layoutMode: 'fitRows',
        transitionDuration: '0.6s',
        stagger: 50,
        fitRows: {
            gutter: 20
        }
    });

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-category');
            
            // Update active state
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');

            // Apply filter with fade effect
            projectGrid.style.opacity = '0';
            setTimeout(() => {
                if (filterValue === 'all') {
                    iso.arrange({ filter: '*' });
                } else {
                    iso.arrange({ filter: `[data-category="${filterValue}"]` });
                }
                
                // Fade back in
                setTimeout(() => {
                    projectGrid.style.opacity = '1';
                }, 100);

                // Update no results message
                const visibleItems = projectGrid.querySelectorAll(filterValue === 'all' ? '.project-card' : `.project-card[data-category="${filterValue}"]`);
                const noResults = document.querySelector('.no-results');
                if (noResults) {
                    noResults.hidden = visibleItems.length > 0;
                }
            }, 300);
        });
    });

    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const cardInner = card.querySelector('.project-card-inner');
        if (cardInner) {
            // For mouse interactions
            card.addEventListener('mouseenter', () => {
                cardInner.style.transform = 'rotateY(180deg)';
            });

            card.addEventListener('mouseleave', () => {
                cardInner.style.transform = 'rotateY(0)';
            });

            // For touch interactions
            card.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const currentTransform = cardInner.style.transform;
                cardInner.style.transform = currentTransform === 'rotateY(180deg)' ? 'rotateY(0)' : 'rotateY(180deg)';
            });

            // For keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const currentTransform = cardInner.style.transform;
                    cardInner.style.transform = currentTransform === 'rotateY(180deg)' ? 'rotateY(0)' : 'rotateY(180deg)';
                }
            });

            // Ensure card is focusable
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
            card.setAttribute('aria-label', 'Flip card to see project details');
        }
    });

    // Trigger layout after images are loaded
    imagesLoaded(projectGrid, function() {
        iso.layout();
        projectGrid.style.opacity = '1';
    });
});

// Skills Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const skillsWrapper = document.querySelector('.skills-wrapper');
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillCategories = document.querySelectorAll('.skill-category');

    // Initialize with 'all' category visible
    showAllCategories();

    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const selectedCategory = button.getAttribute('data-category');
            
            if (selectedCategory === 'all') {
                showAllCategories();
            } else {
                filterSkills(selectedCategory);
            }
        });
    });

    function showAllCategories() {
        skillCategories.forEach(category => {
            category.style.display = 'block';
            // Trigger animation for skill items
            const skillItems = category.querySelectorAll('.skill-item');
            animateSkillItems(skillItems);
        });
    }

    function filterSkills(category) {
        skillCategories.forEach(skillCategory => {
            const categoryType = skillCategory.getAttribute('data-category');
            if (categoryType === category) {
                skillCategory.style.display = 'block';
                // Animate skill items when category becomes visible
                const skillItems = skillCategory.querySelectorAll('.skill-item');
                animateSkillItems(skillItems);
            } else {
                skillCategory.style.display = 'none';
            }
        });
    }

    function animateSkillItems(items) {
        items.forEach((item, index) => {
            // Reset the progress
            item.style.setProperty('--progress', '0%');
            
            // Get the progress value from the data attribute
            const progress = item.getAttribute('data-progress') + '%';
            
            // Add a slight delay for each item
            setTimeout(() => {
                item.style.setProperty('--progress', progress);
            }, index * 100); // 100ms delay between each item
        });
    }

    // Initialize progress bars for visible skills
    const initialSkillItems = document.querySelectorAll('.skill-item');
    animateSkillItems(initialSkillItems);
}); 