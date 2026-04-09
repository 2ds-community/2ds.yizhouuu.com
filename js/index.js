(() => {
    const carousel = document.getElementById('carousel');
    const bgLayers = Array.from(document.querySelectorAll('.page-bg-image'));

    const images = [
        'flower-2.webp',
        '2025-11-19_14.42.12.webp',
        '2025-11-30_03.35.42.webp',
        '2026-01-17_03.42.11.webp',
        '2026-04-08_14.21.35.webp',
        '2026-04-08_14.39.47.webp',
    ];
    const basePath = 'assets/img/index-bg/';
    const slideInterval = 8000;
    const preloadedImages = new Set();
    let visibleBgIndex = 0;

    function getImageUrl(index) {
        return `${basePath}${images[index]}`;
    }

    function preloadImage(index) {
        const url = getImageUrl(index);
        if (preloadedImages.has(url)) return;
        const img = new Image();
        img.src = url;
        preloadedImages.add(url);
    }

    function preloadNextImage() {
        if (images.length <= 1) return;
        const nextIndex = (current + 1) % images.length;
        preloadImage(nextIndex);
    }

    function setBackground(index, immediate = false) {
        const nextUrl = getImageUrl(index);

        if (immediate || bgLayers.length < 2) {
            bgLayers[visibleBgIndex].style.backgroundImage = `url('${nextUrl}')`;
            bgLayers[visibleBgIndex].classList.add('is-visible');
            return;
        }

        const nextLayerIndex = visibleBgIndex === 0 ? 1 : 0;
        const currentLayer = bgLayers[visibleBgIndex];
        const nextLayer = bgLayers[nextLayerIndex];

        nextLayer.style.backgroundImage = `url('${nextUrl}')`;
        nextLayer.classList.add('is-visible');
        currentLayer.classList.remove('is-visible');
        visibleBgIndex = nextLayerIndex;
    }

    images.forEach((filename, i) => {
        const slide = document.createElement('div');
        slide.className = 'slide' + (i === 0 ? ' active' : '');
        const img = document.createElement('img');
        img.src = getImageUrl(i);
        img.alt = '';
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.draggable = false;
        slide.appendChild(img);
        carousel.appendChild(slide);
    });

    const indicatorWrap = document.createElement('div');
    indicatorWrap.className = 'carousel-indicators';
    images.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        indicatorWrap.appendChild(dot);
    });
    carousel.appendChild(indicatorWrap);

    const slides = carousel.querySelectorAll('.slide');
    const dots = carousel.querySelectorAll('.carousel-dot');
    let current = 0;
    let timer = null;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');

        current = index;

        slides[current].classList.add('active');
        dots[current].classList.add('active');
        setBackground(current);
        preloadNextImage();

        resetTimer();
    }

    function next() {
        goTo((current + 1) % slides.length);
    }

    function resetTimer() {
        clearInterval(timer);
        if (slides.length > 1) timer = setInterval(next, slideInterval);
    }

    preloadImage(0);
    setBackground(0, true);
    preloadNextImage();
    if (slides.length > 1) timer = setInterval(next, slideInterval);
    if (slides.length <= 1) indicatorWrap.style.display = 'none';

})();
