document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // DYNAMIC GALLERY CONFIGURATION
    // ---------------------------------------------------------
    const localPhotos = [
        '20241211022017_1.jpg', 
        '12.png', 
        '125827f4219c3378.png', 
        '3e15edc0237c83b1.png', 
        '6d4a238acb439690.png', 
        '7cc7291dc5c6c5ce.png', 
        '88f7d511240b5e76.png', 
        'a.png', 
        'd.png', 
        'ddd.png', 
        'f.png', 
        'fff.png', 
        'ff.png', 
        'Foxhole_2024.06.27-23.17.png', 
        'h.jpg', 
        'hh.png', 
        'image.png', 
        'ss.png'
    ];

    const onlinePhotos = [
        "stroi.png",
    ];

    const allGalleryImages = [...localPhotos, ...onlinePhotos];

    // Function to render gallery
    const renderGallery = () => {
        const galleryContainer = document.getElementById('gallery-grid');
        if (!galleryContainer) return;

        galleryContainer.innerHTML = '';

        allGalleryImages.forEach((src, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item group cursor-pointer';
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Battle Scene ${index + 1}`;

            item.appendChild(img);
            galleryContainer.appendChild(item);
        });

        // Re-attach lightbox listeners after rendering
        attachLightboxListeners();
    };

    // ---------------------------------------------------------
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ---------------------------------------------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // ---------------------------------------------------------
    // MOBILE MENU TOGGLE
    // ---------------------------------------------------------
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if(mobileBtn && mobileMenu) {
        mobileBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
    }

    // ---------------------------------------------------------
    // VIDEO CAROUSEL LOGIC
    // ---------------------------------------------------------
    const videoFrame = document.getElementById('video-frame');
    const videoTitle = document.getElementById('video-title');
    const videoDesc = document.getElementById('video-desc');
    const prevVideoBtn = document.getElementById('prev-video');
    const nextVideoBtn = document.getElementById('next-video');

    const videos = [
        {
            src: "https://www.youtube.com/embed/rPSpzMv0hZk?start=48",
            title: "Обзор Клана",
            desc: "Foxhole Operations"
        },
        {
            src: "https://www.youtube.com/embed/JyOW7YJWgow?start=86",
            title: "Вступай в AFC",
            desc: "Join the Colonials"
        },
        {
            src: "https://www.youtube.com/embed/TDqG3S8gMPY",
            title: "Battle Report",
            desc: "Combat Footage"
        }
    ];

    let currentVideoIndex = 0;

    const updateVideo = () => {
        if (!videoFrame) return;
        const video = videos[currentVideoIndex];
        videoFrame.style.opacity = '0';
        setTimeout(() => {
            videoFrame.src = video.src;
            if (videoTitle) videoTitle.textContent = video.title;
            if (videoDesc) videoDesc.textContent = video.desc;
            videoFrame.style.opacity = '1';
        }, 300);
    };

    if (prevVideoBtn && nextVideoBtn) {
        prevVideoBtn.addEventListener('click', () => {
            currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
            updateVideo();
        });

        nextVideoBtn.addEventListener('click', () => {
            currentVideoIndex = (currentVideoIndex + 1) % videos.length;
            updateVideo();
        });
    }

    // ---------------------------------------------------------
    // LIGHTBOX LOGIC
    // ---------------------------------------------------------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    
    let currentImageIndex = 0;
    let galleryImages = [];

    const attachLightboxListeners = () => {
        galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
        
        galleryImages.forEach((img, index) => {
            img.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(index);
            });
        });
    };

    const openLightbox = (index) => {
        if (!lightbox || galleryImages.length === 0) return;
        currentImageIndex = index;
        lightboxImg.src = galleryImages[index].src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    const showNextImage = (e) => {
        if(e) e.stopPropagation();
        if (galleryImages.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImageIndex].src;
    };

    const showPrevImage = (e) => {
        if(e) e.stopPropagation();
        if (galleryImages.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImageIndex].src;
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', showNextImage);
    if (prevBtn) prevBtn.addEventListener('click', showPrevImage);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        lightbox.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY > 0) {
                showNextImage();
            } else {
                showPrevImage();
            }
        });
    }
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });

    // ---------------------------------------------------------
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ---------------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                if (mobileMenu) mobileMenu.classList.add('hidden');
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------------------------------------------------------
    // AUTO-RELOAD ON STATIC FILE CHANGE
    // ---------------------------------------------------------
    const startChangeMonitor = () => {
        const baseUrl = window.location.origin;
        const fileUrls = [
            `${baseUrl}/index.html`,
            `${baseUrl}/info.html`,
            `${baseUrl}/media.html`,
            `${baseUrl}/work.html`,
            `${baseUrl}/join.html`,
            `${baseUrl}/veli.html`,
            `${baseUrl}/shop.html`,
            `${baseUrl}/styles.css`,
            `${baseUrl}/app.js`
        ];
        const signatures = new Map();
        const overlay = document.getElementById('update-overlay');
        let isReloading = false;
        let isInitialized = false;

        const fetchSignature = async (url) => {
            const cacheBustUrl = `${url}?v=${Date.now()}`;
            try {
                const headResponse = await fetch(cacheBustUrl, { method: 'HEAD', cache: 'no-store' });
                if (headResponse.ok) {
                    return `${headResponse.headers.get('etag') || ''}-${headResponse.headers.get('last-modified') || ''}-${headResponse.headers.get('content-length') || ''}`;
                }
            } catch (error) {
                // Fallback to GET below
            }

            try {
                const getResponse = await fetch(cacheBustUrl, { method: 'GET', cache: 'no-store' });
                if (!getResponse.ok) return '';
                const text = await getResponse.text();
                return `${getResponse.headers.get('etag') || ''}-${getResponse.headers.get('last-modified') || ''}-${text.length}`;
            } catch (error) {
                return '';
            }
        };

        const showOverlay = () => {
            if (!overlay) return;
            overlay.classList.add('active');
        };

        const checkForUpdates = async () => {
            if (isReloading) return;
            try {
                const results = await Promise.all(fileUrls.map(fetchSignature));
                let changed = false;

                results.forEach((signature, index) => {
                    if (!signature) return;
                    const url = fileUrls[index];
                    const previous = signatures.get(url);
                    if (isInitialized && previous && previous !== signature) {
                        changed = true;
                    }
                    signatures.set(url, signature);
                });

                if (!isInitialized) {
                    isInitialized = true;
                    return;
                }

                if (changed) {
                    isReloading = true;
                    showOverlay();
                    setTimeout(() => {
                        window.location.reload();
                    }, 600);
                }
            } catch (error) {
                // Silently ignore to avoid console spam on restrictive hosts
            }
        };

        checkForUpdates();
        setInterval(checkForUpdates, 15000);
    };

    // ---------------------------------------------------------
    // INITIALIZE
    // ---------------------------------------------------------
    renderGallery();
    startChangeMonitor();
});
