// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
});

// City and District Data
const cityDistricts = {
    riyadh: ['العليا', 'الملز', 'النرجس', 'الياسمين', 'الروضة', 'السليمانية', 'المروج'],
    jeddah: ['الروضة', 'الزهراء', 'النزهة', 'الحمراء', 'البساتين', 'الصفا', 'المرجان'],
    medina: ['الأزهري', 'العوالي', 'الحرة الشرقية', 'قباء', 'الجرف', 'المطار', 'العيون'],
    mecca: ['العزيزية', 'الشوقية', 'الكعكية', 'النوارية', 'الحجون', 'المسفلة', 'جرول'],
    dammam: ['الفيصلية', 'الشاطئ', 'الجلوية', 'الأندلس', 'الخليج', 'النور', 'الصناعية'],
    khobar: ['الراكة', 'الثقبة', 'العقربية', 'الجسر', 'الكورنيش', 'الخزامى', 'الأمانة']
};

// Update districts based on selected city
const citySelect = document.getElementById('city-select');
const districtSelect = document.getElementById('district-select');

citySelect.addEventListener('change', function() {
    const selectedCity = this.value;
    districtSelect.innerHTML = '<option value="">اختر الحي</option>';
    
    if (selectedCity && cityDistricts[selectedCity]) {
        cityDistricts[selectedCity].forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            districtSelect.appendChild(option);
        });
    }
});

// Property filtering
const tabButtons = document.querySelectorAll('.tab-btn');
const propertyCards = document.querySelectorAll('.property-card');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        
        propertyCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.6s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Search functionality
const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const city = citySelect.value;
    const district = districtSelect.value;
    const propertyType = document.getElementById('property-type').value;
    
    // Filter properties based on search criteria
    filterProperties(city, district, propertyType);
    
    // Scroll to properties section
    document.getElementById('properties').scrollIntoView({ behavior: 'smooth' });
});

function filterProperties(city, district, propertyType) {
    propertyCards.forEach(card => {
        let showCard = true;
        
        // Check property type
        if (propertyType && card.getAttribute('data-category') !== propertyType) {
            showCard = false;
        }
        
        // Check city and district (simplified check based on property location text)
        if (city || district) {
            const locationText = card.querySelector('.property-location').textContent;
            
            if (city) {
                const cityNames = {
                    riyadh: 'الرياض',
                    jeddah: 'جدة',
                    medina: 'المدينة المنورة',
                    mecca: 'مكة المكرمة',
                    dammam: 'الدمام',
                    khobar: 'الخبر'
                };
                
                if (!locationText.includes(cityNames[city])) {
                    showCard = false;
                }
            }
            
            if (district && !locationText.includes(district)) {
                showCard = false;
            }
        }
        
        if (showCard) {
            card.style.display = 'block';
            card.style.animation = 'fadeInUp 0.6s ease';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Update active tab
    tabButtons.forEach(btn => btn.classList.remove('active'));
    if (propertyType) {
        const targetTab = document.querySelector(`[data-category="${propertyType}"]`);
        if (targetTab) targetTab.classList.add('active');
    } else {
        document.querySelector('[data-category="all"]').classList.add('active');
    }
}

// Property Modal
const modal = document.getElementById('propertyModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.close');

// Property data for modal
const propertyData = {
    villa1: {
        title: 'فيلا فاخرة للتمليك',
        location: 'المدينة المنورة - حي الأزهري',
        price: '2,500,000 ريال',
        type: 'للتمليك',
        images: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        details: {
            bedrooms: '5 غرف نوم',
            bathrooms: '4 حمامات',
            area: '400 م²',
            parking: 'مواقف سيارات',
            garden: 'حديقة خاصة',
            pool: 'مسبح'
        },
        description: 'فيلا فاخرة تتميز بالتصميم العصري والموقع المتميز في حي الأزهري بالمدينة المنورة. تحتوي على جميع وسائل الراحة والرفاهية.',
        features: [
            'تكييف مركزي',
            'نظام أمان متطور',
            'مطبخ مجهز بالكامل',
            'غرفة خادمة',
            'مجلس رجال منفصل',
            'صالة استقبال واسعة'
        ]
    },
    apartment1: {
        title: 'شقة عصرية مفروشة',
        location: 'الرياض - حي العليا',
        price: '3,500 ريال/شهرياً',
        type: 'للإيجار',
        images: [
            'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2724748/pexels-photo-2724748.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        details: {
            bedrooms: '3 غرف نوم',
            bathrooms: '2 حمام',
            area: '150 م²',
            parking: 'موقف سيارة',
            furnished: 'مفروشة بالكامل',
            floor: 'الدور الخامس'
        },
        description: 'شقة عصرية مفروشة بالكامل في موقع متميز بحي العليا. مناسبة للعائلات الصغيرة أو المهنيين.',
        features: [
            'أثاث عصري',
            'إنترنت مجاني',
            'خدمة تنظيف أسبوعية',
            'أمان 24 ساعة',
            'قريبة من المولات',
            'إطلالة رائعة'
        ]
    },
    land1: {
        title: 'أرض تجارية مميزة',
        location: 'جدة - حي الروضة',
        price: '1,800,000 ريال',
        type: 'للبيع',
        images: [
            'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        details: {
            area: '1000 م²',
            streets: 'شارعين',
            width: 'عرض 25 متر',
            depth: 'عمق 40 متر',
            certificate: 'صك إلكتروني',
            zoning: 'تجاري'
        },
        description: 'أرض تجارية في موقع استراتيجي بحي الروضة في جدة. مناسبة لإقامة مشاريع تجارية متنوعة.',
        features: [
            'موقع تجاري ممتاز',
            'قريبة من الطرق الرئيسية',
            'خدمات متكاملة',
            'إمكانية البناء فوراً',
            'عائد استثماري مضمون',
            'سهولة الوصول'
        ]
    },
    building1: {
        title: 'عمارة استثمارية',
        location: 'الدمام - حي الفيصلية',
        price: '8,500,000 ريال',
        type: 'للتمليك',
        images: [
            'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        details: {
            floors: '4 أدوار',
            units: '16 وحدة سكنية',
            area: '1200 م²',
            return: 'عائد 8% سنوياً',
            parking: '20 موقف سيارة',
            elevator: 'مصعد'
        },
        description: 'عمارة استثمارية متكاملة في موقع حيوي بالدمام. تحقق عائد استثماري ممتاز.',
        features: [
            'وحدات مؤجرة بالكامل',
            'صيانة دورية',
            'إدارة احترافية',
            'موقع متميز',
            'عائد مضمون',
            'فرصة استثمارية ممتازة'
        ]
    },
    farm1: {
        title: 'مزرعة نموذجية',
        location: 'القصيم - بريدة',
        price: '5,200,000 ريال',
        type: 'للبيع',
        images: [
            'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        details: {
            area: '50,000 م²',
            water: 'بئر ارتوازي',
            crops: 'مزروعة نخيل',
            house: 'بيت مزرعة',
            electricity: 'كهرباء متصلة',
            fence: 'مسورة بالكامل'
        },
        description: 'مزرعة نموذجية في منطقة القصيم، مزروعة بأشجار النخيل المثمرة مع جميع المرافق.',
        features: [
            'إنتاج سنوي ممتاز',
            'نظام ري حديث',
            'مخازن للمعدات',
            'طريق معبد',
            'عمالة مدربة',
            'عائد زراعي مجزي'
        ]
    },
    shop1: {
        title: 'محل تجاري مميز',
        location: 'مكة المكرمة - العزيزية',
        price: '8,000 ريال/شهرياً',
        type: 'للإيجار',
        images: [
            'https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        details: {
            area: '80 م²',
            frontage: 'واجهة زجاجية',
            parking: 'مواقف متاحة',
            location: 'شارع تجاري رئيسي',
            facilities: 'مرافق متكاملة',
            access: 'سهولة الوصول'
        },
        description: 'محل تجاري في موقع حيوي بالعزيزية، مناسب لجميع الأنشطة التجارية.',
        features: [
            'حركة مرور عالية',
            'قريب من المساجد',
            'مواصلات متوفرة',
            'خدمات قريبة',
            'عملاء دائمون',
            'فرصة تجارية ممتازة'
        ]
    },
    office1: {
        title: 'مكتب إداري راقي',
        location: 'الرياض - برج المملكة',
        price: '12,000 ريال/شهرياً',
        type: 'للإيجار',
        images: [
            'https://images.pexels.com/photos/2883049/pexels-photo-2883049.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        details: {
            area: '200 م²',
            furnished: 'مفروش بالكامل',
            internet: 'إنترنت عالي السرعة',
            parking: 'مواقف مخصصة',
            security: 'أمان 24 ساعة',
            floor: 'الدور 15'
        },
        description: 'مكتب إداري راقي في برج المملكة بالرياض، مجهز بأحدث التقنيات.',
        features: [
            'إطلالة بانورامية',
            'قاعة اجتماعات',
            'استقبال مميز',
            'تكييف مركزي',
            'خدمات إدارية',
            'موقع مرموق'
        ]
    },
    villa2: {
        title: 'فيلا عصرية بالتقسيط',
        location: 'الخبر - حي الراكة',
        price: '3,200,000 ريال',
        type: 'بالتقسيط',
        images: [
            'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        details: {
            bedrooms: '6 غرف نوم',
            bathrooms: '5 حمامات',
            area: '500 م²',
            parking: 'مواقف متعددة',
            garden: 'حديقة واسعة',
            installment: 'تقسيط 10 سنوات'
        },
        description: 'فيلا عصرية بنظام التقسيط المريح في حي الراكة بالخبر.',
        features: [
            'تقسيط بدون فوائد',
            'تسليم فوري',
            'ضمان شامل',
            'تصميم عصري',
            'موقع هادئ',
            'قريبة من الخدمات'
        ]
    }
};

function openPropertyModal(propertyId) {
    const property = propertyData[propertyId];
    if (!property) return;
    
    const modalHTML = `
        <div style="position: relative;">
            <div class="property-modal-header" style="position: relative; height: 300px; overflow: hidden; border-radius: 15px 15px 0 0;">
                <img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)); display: flex; align-items: end; padding: 2rem;">
                    <div style="color: white;">
                        <h2 style="font-size: 2rem; margin-bottom: 0.5rem;">${property.title}</h2>
                        <p style="font-size: 1.1rem; margin-bottom: 0.5rem;"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <span style="background: linear-gradient(45deg, #d4af37, #f59e0b); padding: 5px 15px; border-radius: 20px; font-weight: 600;">${property.type}</span>
                            <span style="font-size: 1.5rem; font-weight: 700;">${property.price}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="padding: 2rem;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                    <div>
                        <h3 style="color: #2c5aa0; margin-bottom: 1rem; font-size: 1.3rem;">تفاصيل العقار</h3>
                        <div style="display: grid; gap: 0.5rem;">
                            ${Object.entries(property.details).map(([key, value]) => 
                                `<div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #e5e7eb;">
                                    <span style="color: #666;">${value}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="color: #2c5aa0; margin-bottom: 1rem; font-size: 1.3rem;">المميزات</h3>
                        <div style="display: grid; gap: 0.5rem;">
                            ${property.features.map(feature => 
                                `<div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i class="fas fa-check" style="color: #10b981;"></i>
                                    <span>${feature}</span>
                                </div>`
                            ).join('')}
                        </div>
                    </div>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #2c5aa0; margin-bottom: 1rem; font-size: 1.3rem;">الوصف</h3>
                    <p style="line-height: 1.8; color: #666;">${property.description}</p>
                </div>
                
                ${property.images.length > 1 ? `
                <div style="margin-bottom: 2rem;">
                    <h3 style="color: #2c5aa0; margin-bottom: 1rem; font-size: 1.3rem;">صور إضافية</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                        ${property.images.slice(1).map(img => 
                            `<img src="${img}" alt="صورة العقار" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; cursor: pointer;" onclick="this.style.transform = this.style.transform ? '' : 'scale(1.5)'; this.style.zIndex = this.style.zIndex ? '' : '1000'; this.style.position = this.style.position ? '' : 'relative';">`
                        ).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div style="display: flex; gap: 1rem; justify-content: center;">
                    <button onclick="contactForProperty('${propertyId}')" style="background: linear-gradient(45deg, #2c5aa0, #1e40af); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-family: 'Cairo', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-phone"></i> تواصل معنا
                    </button>
                    <button onclick="requestVisit('${propertyId}')" style="background: linear-gradient(45deg, #d4af37, #f59e0b); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-family: 'Cairo', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">
                        <i class="fas fa-calendar"></i> طلب زيارة
                    </button>
                </div>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = modalHTML;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function contactForProperty(propertyId) {
    const property = propertyData[propertyId];
    const message = `مرحباً، أنا مهتم بالعقار: ${property.title} في ${property.location}`;
    const whatsappUrl = `https://wa.me/966111234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function requestVisit(propertyId) {
    const property = propertyData[propertyId];
    alert(`تم تسجيل طلب زيارة للعقار: ${property.title}\nسيتم التواصل معك قريباً لتحديد موعد الزيارة.`);
}

// Close modal
closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    alert('تم إرسال رسالتك بنجاح! سيتم التواصل معك قريباً.');
    this.reset();
});

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

// Animate elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.property-card, .service-card, .about-text, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add some interactive effects
document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Add typing effect to hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 150);
        }, 1000);
    }
});

// Add counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }
    
    updateCounter();
}

// Initialize counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat h3');
            counters.forEach(counter => {
                const target = parseInt(counter.textContent);
                animateCounter(counter, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
});

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}