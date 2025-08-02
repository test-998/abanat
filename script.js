// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initializeAnimations();
    }, 2000);
});

// Particles Animation
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Navigation
const nav = document.querySelector('.floating-nav');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            document.querySelector(`[href="#${sectionId}"]`).classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Search functionality
const searchTabs = document.querySelectorAll('.search-tab');
const searchForm = document.querySelector('.search-form');
const citySelect = document.getElementById('city-select');
const districtSelect = document.getElementById('district-select');

// City and District Data
const cityDistricts = {
    riyadh: ['العليا', 'الملز', 'النرجس', 'الياسمين', 'الروضة', 'السليمانية', 'المروج', 'الحمراء', 'الربوة'],
    jeddah: ['الروضة', 'الزهراء', 'النزهة', 'الحمراء', 'البساتين', 'الصفا', 'المرجان', 'الشاطئ', 'الكندرة'],
    medina: ['الأزهري', 'العوالي', 'الحرة الشرقية', 'قباء', 'الجرف', 'المطار', 'العيون', 'الحرة الغربية'],
    mecca: ['العزيزية', 'الشوقية', 'الكعكية', 'النوارية', 'الحجون', 'المسفلة', 'جرول', 'الزاهر'],
    dammam: ['الفيصلية', 'الشاطئ', 'الجلوية', 'الأندلس', 'الخليج', 'النور', 'الصناعية', 'الضباب'],
    khobar: ['الراكة', 'الثقبة', 'العقربية', 'الجسر', 'الكورنيش', 'الخزامى', 'الأمانة', 'الحزم']
};

// Search tabs functionality
searchTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        searchTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Update districts based on selected city
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

// Search form submission
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const searchData = Object.fromEntries(formData);
    
    // Filter properties based on search criteria
    filterProperties(searchData);
    
    // Scroll to properties section
    document.getElementById('properties').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
});

// Property filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const propertyCards = document.querySelectorAll('.property-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.getAttribute('data-filter');
        
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

function filterProperties(searchData) {
    const { city, district, propertyType } = searchData;
    
    propertyCards.forEach(card => {
        let showCard = true;
        
        // Check property type
        if (propertyType && card.getAttribute('data-category') !== propertyType) {
            showCard = false;
        }
        
        // Check city and district (simplified check based on property location text)
        if (city || district) {
            const locationText = card.querySelector('.property-location span').textContent;
            
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
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    if (propertyType) {
        const targetButton = document.querySelector(`[data-filter="${propertyType}"]`);
        if (targetButton) targetButton.classList.add('active');
    } else {
        document.querySelector('[data-filter="all"]').classList.add('active');
    }
}

// Property Modal
const modal = document.getElementById('propertyModal');
const modalContent = document.getElementById('modalContent');
const closeBtn = document.querySelector('.modal-close');

// Property data for modal
const propertyData = {
    villa1: {
        title: 'فيلا فاخرة للتمليك',
        location: 'المدينة المنورة - حي الأزهري',
        price: '2,500,000 ريال',
        type: 'للتمليك',
        agent: {
            name: 'أحمد السعيد',
            title: 'مستشار عقاري',
            phone: '+966 50 123 4567',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
        images: [
            'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=800',
            'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800'
        ],
        details: {
            bedrooms: '5 غرف نوم',
            bathrooms: '4 حمامات',
            area: '400 م²',
            parking: 'مواقف سيارات',
            garden: 'حديقة خاصة',
            pool: 'مسبح',
            floors: 'دورين',
            age: 'جديدة'
        },
        description: 'فيلا فاخرة تتميز بالتصميم العصري والموقع المتميز في حي الأزهري بالمدينة المنورة. تحتوي على جميع وسائل الراحة والرفاهية مع إطلالة رائعة وتشطيبات عالية الجودة.',
        features: [
            'تكييف مركزي',
            'نظام أمان متطور',
            'مطبخ مجهز بالكامل',
            'غرفة خادمة',
            'مجلس رجال منفصل',
            'صالة استقبال واسعة',
            'شبكة إنترنت',
            'نظام صوتي'
        ]
    },
    apartment1: {
        title: 'شقة عصرية مفروشة',
        location: 'الرياض - حي العليا',
        price: '3,500 ريال/شهرياً',
        type: 'للإيجار',
        agent: {
            name: 'سارة أحمد',
            title: 'مستشارة عقارية',
            phone: '+966 50 234 5678',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
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
            floor: 'الدور الخامس',
            elevator: 'مصعد',
            balcony: 'شرفة'
        },
        description: 'شقة عصرية مفروشة بالكامل في موقع متميز بحي العليا. مناسبة للعائلات الصغيرة أو المهنيين مع جميع وسائل الراحة.',
        features: [
            'أثاث عصري',
            'إنترنت مجاني',
            'خدمة تنظيف أسبوعية',
            'أمان 24 ساعة',
            'قريبة من المولات',
            'إطلالة رائعة',
            'مكيفة بالكامل',
            'مطبخ مجهز'
        ]
    },
    land1: {
        title: 'أرض تجارية مميزة',
        location: 'جدة - حي الروضة',
        price: '1,800,000 ريال',
        type: 'للبيع',
        agent: {
            name: 'محمد العلي',
            title: 'خبير أراضي',
            phone: '+966 50 345 6789',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
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
            zoning: 'تجاري',
            corner: 'زاوية',
            services: 'خدمات متكاملة'
        },
        description: 'أرض تجارية في موقع استراتيجي بحي الروضة في جدة. مناسبة لإقامة مشاريع تجارية متنوعة مع إمكانيات استثمارية ممتازة.',
        features: [
            'موقع تجاري ممتاز',
            'قريبة من الطرق الرئيسية',
            'خدمات متكاملة',
            'إمكانية البناء فوراً',
            'عائد استثماري مضمون',
            'سهولة الوصول',
            'منطقة نمو',
            'تراخيص سهلة'
        ]
    },
    building1: {
        title: 'عمارة استثمارية',
        location: 'الدمام - حي الفيصلية',
        price: '8,500,000 ريال',
        type: 'للتمليك',
        agent: {
            name: 'خالد المطيري',
            title: 'خبير استثمار',
            phone: '+966 50 456 7890',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
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
            elevator: 'مصعد',
            maintenance: 'صيانة شاملة',
            occupancy: '100% مؤجرة'
        },
        description: 'عمارة استثمارية متكاملة في موقع حيوي بالدمام. تحقق عائد استثماري ممتاز مع إدارة احترافية.',
        features: [
            'وحدات مؤجرة بالكامل',
            'صيانة دورية',
            'إدارة احترافية',
            'موقع متميز',
            'عائد مضمون',
            'فرصة استثمارية ممتازة',
            'نمو في القيمة',
            'سيولة عالية'
        ]
    },
    farm1: {
        title: 'مزرعة نموذجية',
        location: 'القصيم - بريدة',
        price: '5,200,000 ريال',
        type: 'للبيع',
        agent: {
            name: 'عبدالله الزهراني',
            title: 'خبير مزارع',
            phone: '+966 50 567 8901',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
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
            fence: 'مسورة بالكامل',
            irrigation: 'نظام ري حديث',
            storage: 'مخازن'
        },
        description: 'مزرعة نموذجية في منطقة القصيم، مزروعة بأشجار النخيل المثمرة مع جميع المرافق والخدمات.',
        features: [
            'إنتاج سنوي ممتاز',
            'نظام ري حديث',
            'مخازن للمعدات',
            'طريق معبد',
            'عمالة مدربة',
            'عائد زراعي مجزي',
            'موقع استراتيجي',
            'تربة خصبة'
        ]
    },
    shop1: {
        title: 'محل تجاري مميز',
        location: 'مكة المكرمة - العزيزية',
        price: '8,000 ريال/شهرياً',
        type: 'للإيجار',
        agent: {
            name: 'فاطمة الحربي',
            title: 'مستشارة تجارية',
            phone: '+966 50 678 9012',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
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
            access: 'سهولة الوصول',
            visibility: 'رؤية عالية',
            foot_traffic: 'حركة مشاة كثيفة'
        },
        description: 'محل تجاري في موقع حيوي بالعزيزية، مناسب لجميع الأنشطة التجارية مع حركة مرور عالية.',
        features: [
            'حركة مرور عالية',
            'قريب من المساجد',
            'مواصلات متوفرة',
            'خدمات قريبة',
            'عملاء دائمون',
            'فرصة تجارية ممتازة',
            'تشطيبات جيدة',
            'مرونة في الاستخدام'
        ]
    },
    office1: {
        title: 'مكتب إداري راقي',
        location: 'الرياض - برج المملكة',
        price: '12,000 ريال/شهرياً',
        type: 'للإيجار',
        agent: {
            name: 'يوسف الشمري',
            title: 'مستشار مكاتب',
            phone: '+966 50 789 0123',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
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
            floor: 'الدور 15',
            meeting_rooms: 'قاعات اجتماعات',
            reception: 'استقبال'
        },
        description: 'مكتب إداري راقي في برج المملكة بالرياض، مجهز بأحدث التقنيات وإطلالة بانورامية.',
        features: [
            'إطلالة بانورامية',
            'قاعة اجتماعات',
            'استقبال مميز',
            'تكييف مركزي',
            'خدمات إدارية',
            'موقع مرموق',
            'تقنيات حديثة',
            'خدمات متكاملة'
        ]
    },
    villa2: {
        title: 'فيلا عصرية بالتقسيط',
        location: 'الخبر - حي الراكة',
        price: '3,200,000 ريال',
        type: 'بالتقسيط',
        agent: {
            name: 'نورا القحطاني',
            title: 'مستشارة تقسيط',
            phone: '+966 50 890 1234',
            image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
        },
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
            installment: 'تقسيط 10 سنوات',
            down_payment: 'مقدم 20%',
            monthly: 'قسط شهري مريح'
        },
        description: 'فيلا عصرية بنظام التقسيط المريح في حي الراكة بالخبر مع تسهيلات دفع مرنة.',
        features: [
            'تقسيط بدون فوائد',
            'تسليم فوري',
            'ضمان شامل',
            'تصميم عصري',
            'موقع هادئ',
            'قريبة من الخدمات',
            'مرونة في السداد',
            'خدمة ما بعد البيع'
        ]
    }
};

function openPropertyModal(propertyId) {
    const property = propertyData[propertyId];
    if (!property) return;
    
    const modalHTML = `
        <div class="property-modal-header" style="position: relative; height: 400px; overflow: hidden; border-radius: 20px 20px 0 0;">
            <div class="property-gallery" style="position: relative; width: 100%; height: 100%;">
                <div class="main-image" style="width: 100%; height: 100%;">
                    <img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="gallery-nav" style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); display: flex; gap: 10px;">
                    ${property.images.map((img, index) => 
                        `<button class="gallery-thumb ${index === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)" style="width: 60px; height: 40px; border: 2px solid ${index === 0 ? '#d4af37' : 'rgba(255,255,255,0.5)'}; border-radius: 5px; overflow: hidden; cursor: pointer; transition: all 0.3s ease;">
                            <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;">
                        </button>`
                    ).join('')}
                </div>
            </div>
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)); display: flex; align-items: end; padding: 2rem;">
                <div style="color: white; width: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: end; width: 100%;">
                        <div>
                            <h2 style="font-size: 2.5rem; margin-bottom: 0.5rem; font-weight: 900;">${property.title}</h2>
                            <p style="font-size: 1.2rem; margin-bottom: 1rem; opacity: 0.9;"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                            <div style="display: flex; align-items: center; gap: 1rem;">
                                <span style="background: linear-gradient(45deg, #d4af37, #f59e0b); padding: 8px 20px; border-radius: 25px; font-weight: 600; font-size: 0.9rem;">${property.type}</span>
                                <span style="font-size: 2rem; font-weight: 900; color: #d4af37;">${property.price}</span>
                            </div>
                        </div>
                        <div class="agent-card" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 15px; border-radius: 15px; text-align: center; min-width: 150px;">
                            <img src="${property.agent.image}" alt="${property.agent.name}" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px; border: 3px solid #d4af37;">
                            <h4 style="font-size: 1rem; margin-bottom: 5px;">${property.agent.name}</h4>
                            <p style="font-size: 0.8rem; opacity: 0.8; margin-bottom: 10px;">${property.agent.title}</p>
                            <button onclick="contactAgent('${property.agent.phone}')" style="background: #25d366; color: white; border: none; padding: 8px 15px; border-radius: 20px; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 5px; margin: 0 auto;">
                                <i class="fab fa-whatsapp"></i> واتساب
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="padding: 2.5rem;">
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 3rem; margin-bottom: 3rem;">
                <div>
                    <h3 style="color: #1a365d; margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700;">وصف العقار</h3>
                    <p style="line-height: 1.8; color: #4a5568; font-size: 1.1rem; margin-bottom: 2rem;">${property.description}</p>
                    
                    <h3 style="color: #1a365d; margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700;">المميزات</h3>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">
                        ${property.features.map(feature => 
                            `<div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: #f7fafc; border-radius: 8px;">
                                <i class="fas fa-check-circle" style="color: #10b981; font-size: 1.1rem;"></i>
                                <span style="font-weight: 500;">${feature}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
                
                <div>
                    <h3 style="color: #1a365d; margin-bottom: 1.5rem; font-size: 1.5rem; font-weight: 700;">تفاصيل العقار</h3>
                    <div style="background: #f7fafc; padding: 1.5rem; border-radius: 15px;">
                        ${Object.entries(property.details).map(([key, value]) => 
                            `<div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                <span style="color: #4a5568; font-weight: 500;">${value}</span>
                            </div>`
                        ).join('')}
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <button onclick="contactForProperty('${propertyId}')" style="background: linear-gradient(45deg, #1a365d, #2d5a87); color: white; border: none; padding: 15px 30px; border-radius: 50px; font-family: 'Cairo', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; font-size: 1rem;">
                    <i class="fas fa-phone"></i> اتصل بنا
                </button>
                <button onclick="requestVisit('${propertyId}')" style="background: linear-gradient(45deg, #d4af37, #f59e0b); color: white; border: none; padding: 15px 30px; border-radius: 50px; font-family: 'Cairo', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; font-size: 1rem;">
                    <i class="fas fa-calendar"></i> طلب زيارة
                </button>
                <button onclick="shareProperty('${propertyId}')" style="background: linear-gradient(45deg, #8b5cf6, #a78bfa); color: white; border: none; padding: 15px 30px; border-radius: 50px; font-family: 'Cairo', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; font-size: 1rem;">
                    <i class="fas fa-share-alt"></i> مشاركة
                </button>
                <button onclick="addToFavorites('${propertyId}')" style="background: linear-gradient(45deg, #ef4444, #f87171); color: white; border: none; padding: 15px 30px; border-radius: 50px; font-family: 'Cairo', sans-serif; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 10px; font-size: 1rem;">
                    <i class="fas fa-heart"></i> إضافة للمفضلة
                </button>
            </div>
        </div>
    `;
    
    modalContent.innerHTML = modalHTML;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function changeMainImage(imageSrc, thumbElement) {
    const mainImage = document.querySelector('.main-image img');
    const allThumbs = document.querySelectorAll('.gallery-thumb');
    
    mainImage.src = imageSrc;
    
    allThumbs.forEach(thumb => {
        thumb.classList.remove('active');
        thumb.style.border = '2px solid rgba(255,255,255,0.5)';
    });
    
    thumbElement.classList.add('active');
    thumbElement.style.border = '2px solid #d4af37';
}

function contactAgent(phone) {
    const message = 'مرحباً، أنا مهتم بالعقار المعروض';
    const whatsappUrl = `https://wa.me/${phone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function contactForProperty(propertyId) {
    const property = propertyData[propertyId];
    const message = `مرحباً، أنا مهتم بالعقار: ${property.title} في ${property.location}`;
    const whatsappUrl = `https://wa.me/966501234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function requestVisit(propertyId) {
    const property = propertyData[propertyId];
    showNotification(`تم تسجيل طلب زيارة للعقار: ${property.title}`, 'success');
}

function shareProperty(propertyId) {
    const property = propertyData[propertyId];
    if (navigator.share) {
        navigator.share({
            title: property.title,
            text: property.description,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        showNotification('تم نسخ رابط العقار', 'success');
    }
}

function addToFavorites(propertyId) {
    const property = propertyData[propertyId];
    showNotification(`تم إضافة ${property.title} للمفضلة`, 'success');
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
    showNotification('تم إرسال رسالتك بنجاح! سيتم التواصل معك قريباً.', 'success');
    this.reset();
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'}; color: white; padding: 15px 20px; border-radius: 10px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); display: flex; align-items: center; gap: 10px; font-weight: 500;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Counter animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    }
    
    updateCounter();
}

// Initialize counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-target]');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe all stat sections
document.querySelectorAll('.hero-stats, .about-stats').forEach(section => {
    statsObserver.observe(section);
});

// Scroll animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Back to top button
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Property card interactions
document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Favorite button functionality
document.querySelectorAll('.favorite').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = this.querySelector('i');
        
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.style.color = '#ef4444';
            showNotification('تم إضافة العقار للمفضلة', 'success');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.style.color = '';
            showNotification('تم إزالة العقار من المفضلة', 'info');
        }
    });
});

// Share button functionality
document.querySelectorAll('.share').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: 'عقار مميز من أبانات العقارية',
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            showNotification('تم نسخ رابط العقار', 'success');
        }
    });
});

// Initialize animations
function initializeAnimations() {
    // Initialize particles
    initParticles();
    
    // Observe elements for scroll animations
    document.querySelectorAll('.fade-in, .property-card, .service-card, .contact-card').forEach(el => {
        el.classList.add('fade-in');
        scrollObserver.observe(el);
    });
}

// Button ripple effect
document.querySelectorAll('.search-btn, .submit-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = this.querySelector('.btn-ripple');
        if (ripple) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple 0.6s linear';
        }
    });
});

// Load more properties
document.querySelector('.load-more-btn').addEventListener('click', function() {
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
    
    setTimeout(() => {
        this.innerHTML = '<span>عرض المزيد من العقارات</span><i class="fas fa-plus"></i>';
        showNotification('تم تحميل المزيد من العقارات', 'success');
    }, 1500);
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);