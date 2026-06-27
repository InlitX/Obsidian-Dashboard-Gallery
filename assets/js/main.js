const dashboardData = {
    atlas: {
        titleKey: 'dashboards.atlas',
        images: [
            'images/dashboards/Atlas/atlas.png',
            'images/dashboards/Atlas/atlas-2.png'
        ],
        videos: [
            'images/dashboards/Atlas/atlas.mp4'
        ],
        descKey: 'dashboards.atlas.preview',
        specs: ['greeting', 'tagFilter', 'recentNotes', 'bookmarks', 'onThisDay', 'quickCapture', 'heatmap', 'scratchpad', 'pomodoro', 'miniCalendar', 'accentPicker'],
        plugins: ['Dataview'],
        url: 'https://github.com/InlitX/Obsidian-Dashboard-Gallery'
    },
    brutalist: {
        titleKey: 'dashboards.brutalist',
        images: [
            'images/dashboards/Dashboard-Brutalist/Dashboard-Brutalist.png',
            'images/dashboards/Dashboard-Brutalist/Dashboard-Brutalist1.png'
        ],
        videos: [
            'images/dashboards/Dashboard-Brutalist/Dashboard-Brutalist.mp4'
        ],
        descKey: 'dashboards.brutalist.preview',
        specs: ['tasks', 'realTimeClock', 'weather', 'spotify', 'socialCards', 'navCards'],
        plugins: ['Dataview'],
        apiRequired: 'OpenWeatherMap',
        url: 'https://github.com/InlitX/Obsidian-Dashboard-Gallery'
    },
    komoribe: {
        titleKey: 'dashboards.komoribe',
        images: [
            'images/dashboards/komoribe/komoribe.png'
        ],
        videos: [
            'images/dashboards/komoribe/komoribe.mp4'
        ],
        descKey: 'dashboards.komoribe.preview',
        specs: ['customCards', 'miniCalendar', 'pomodoro', 'weeklyHabits', 'weather', 'musicPlayer', 'japaneseClock', 'quickActions'],
        plugins: ['Dataview', 'QuickAdd (optional)'],
        apiRequired: 'OpenWeatherMap',
        url: 'https://github.com/InlitX/Obsidian-Dashboard-Gallery'
    },
    zen: {
        titleKey: 'dashboards.zen',
        images: [
            'images/dashboards/Dashboard-Zen/Dashboard-Zen.png',
            'images/dashboards/Dashboard-Zen/Dashboard-Zen2.png'
        ],
        videos: [
            'images/dashboards/Dashboard-Zen/Dashboard-Zen.mp4'
        ],
        descKey: 'dashboards.zen.preview',
        specs: ['dayGoal', 'taskPipeline', 'habits', 'bioPerf', 'taskPerf', 'serendipity', 'quickActions', 'banner'],
        plugins: ['Dataview'],
        url: 'https://github.com/InlitX/Obsidian-Dashboard-Gallery'
    }
};

let currentDashboardMedia = [];
let currentMediaIndex = 0;

const modal = document.getElementById('dashboardModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalMainImg = document.getElementById('modalMainImg');
const modalMainImgContainer = document.getElementById('modalMainImgContainer');
const modalThumbnails = document.getElementById('modalThumbnails');
const modalPrev = document.getElementById('modalPrev');
const modalNext = document.getElementById('modalNext');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxContent = document.getElementById('lightboxContent');

function getZoomableElement() {
    const src = currentDashboardMedia[currentMediaIndex];
    if (src && src.endsWith('.mp4')) {
        return lightboxContent.querySelector('video');
    }
    return lightboxImg;
}

function openDashboardModal(dashboardId) {
    const data = dashboardData[dashboardId];
    currentDashboardMedia = [...data.images, ...data.videos];
    currentMediaIndex = 0;

    updateModalMainContent();

    document.getElementById('modalTitle').textContent = t(data.titleKey);
    document.getElementById('modalDesc').textContent = t(data.descKey);
    document.getElementById('modalDownload').href = data.url;

    modalThumbnails.innerHTML = currentDashboardMedia.map((src, i) => {
        const isVideo = src.endsWith('.mp4');
        if (isVideo) {
            return `<video src="${src}" class="${i === 0 ? 'active' : ''}" data-index="${i}" muted></video>`;
        }
        return `<img src="${src}" alt="" class="${i === 0 ? 'active' : ''}" data-index="${i}">`;
    }).join('');

    modalThumbnails.querySelectorAll('img, video').forEach(thumb => {
        thumb.addEventListener('click', () => {
            currentMediaIndex = parseInt(thumb.dataset.index);
            updateModalMainContent();
            updateThumbnails();
        });
    });

    document.getElementById('modalSpecs').innerHTML = data.specs.map(spec => `
        <tr><td>${t('modal.specs.' + spec)}</td><td>&#10003;</td></tr>
    `).join('');

    document.getElementById('modalPlugins').innerHTML = data.plugins.map(p => `<span class="plugin-tag">${p}</span>`).join('');

    const apiContainer = document.getElementById('modalApiContainer');
    const apiEl = document.getElementById('modalApi');
    if (data.apiRequired) {
        apiContainer.style.display = 'block';
        const apiLinks = {
            'OpenWeatherMap': 'https://openweathermap.org/'
        };
        const link = apiLinks[data.apiRequired] || '#';
        apiEl.innerHTML = `<a href="${link}" target="_blank" class="plugin-tag plugin-link">${data.apiRequired}</a>`;
    } else {
        apiContainer.style.display = 'none';
    }

    modal.classList.add('active');
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function updateModalMainContent() {
    const src = currentDashboardMedia[currentMediaIndex];
    const isVideo = src.endsWith('.mp4');

    if (isVideo) {
        modalMainImg.style.display = 'none';
        let video = modalMainImgContainer.querySelector('video');
        if (!video) {
            video = document.createElement('video');
            video.controls = true;
            video.loop = true;
            modalMainImgContainer.appendChild(video);
        }
        video.src = src;
        video.style.display = 'block';
    } else {
        modalMainImg.style.display = 'block';
        modalMainImg.src = src;
        const video = modalMainImgContainer.querySelector('video');
        if (video) video.remove();
    }
}

function closeDashboardModal() {
    modal.classList.remove('active');
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

modalMainImgContainer.addEventListener('click', () => {
    const currentSrc = currentDashboardMedia[currentMediaIndex];

    if (currentSrc) {
        if (currentSrc.endsWith('.mp4')) {
            const lightboxVideo = lightboxContent.querySelector('video') || document.createElement('video');
            lightboxVideo.src = currentSrc;
            lightboxVideo.controls = true;
            lightboxVideo.style.display = 'block';
            lightboxVideo.style.maxWidth = '90vw';
            lightboxVideo.style.maxHeight = '90vh';
            lightboxVideo.style.transform = 'scale(1) translate(0px, 0px)';
            lightboxImg.style.display = 'none';
            if (!lightboxVideo.parentNode) lightboxContent.appendChild(lightboxVideo);
        } else {
            lightboxImg.src = currentSrc;
            lightboxImg.style.display = 'block';
            lightboxImg.style.transform = 'scale(1) translate(0px, 0px)';
            const lightboxVideo = lightboxContent.querySelector('video');
            if (lightboxVideo) lightboxVideo.style.display = 'none';
        }
        lightbox.classList.add('active');
    }
});

function closeLightbox() {
    currentScale = 1;
    translateX = 0;
    translateY = 0;
    lightbox.classList.remove('active');
    const el = getZoomableElement();
    if (el) {
        el.classList.remove('zoomed');
        el.style.transform = 'scale(1) translate(0px, 0px)';
    }
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

lightboxPrev.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex - 1 + currentDashboardMedia.length) % currentDashboardMedia.length;
    updateLightboxMedia(currentDashboardMedia[currentMediaIndex]);
});

lightboxNext.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex + 1) % currentDashboardMedia.length;
    updateLightboxMedia(currentDashboardMedia[currentMediaIndex]);
});

function updateLightboxMedia(src) {
    if (src.endsWith('.mp4')) {
        let lightboxVideo = lightboxContent.querySelector('video');
        if (!lightboxVideo) {
            lightboxVideo = document.createElement('video');
            lightboxVideo.controls = true;
            lightboxContent.appendChild(lightboxVideo);
        }
        lightboxVideo.src = src;
        lightboxVideo.style.display = 'block';
        lightboxVideo.style.transform = 'scale(1) translate(0px, 0px)';
        lightboxImg.style.display = 'none';
    } else {
        lightboxImg.src = src;
        lightboxImg.style.display = 'block';
        lightboxImg.style.transform = 'scale(1) translate(0px, 0px)';
        const lightboxVideo = lightboxContent.querySelector('video');
        if (lightboxVideo) lightboxVideo.style.display = 'none';
    }
}

let currentScale = 1;
let isDragging = false;
let startX, startY, translateX = 0, translateY = 0;

lightboxContent.addEventListener('click', (e) => {
    const el = getZoomableElement();
    if (e.target === el) {
        currentScale = currentScale === 1 ? 2 : 1;
        if (currentScale === 1) {
            translateX = 0;
            translateY = 0;
            el.classList.remove('zoomed');
        } else {
            el.classList.add('zoomed');
        }
        el.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
});

lightboxContent.addEventListener('mousedown', (e) => {
    if (currentScale > 1 && e.target === getZoomableElement()) {
        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        e.preventDefault();
    }
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const el = getZoomableElement();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;
        el.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

let initialDistance = 0;
let initialScale = 1;

lightboxContent.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        initialDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        initialScale = currentScale;
    } else if (e.touches.length === 1 && currentScale > 1) {
        isDragging = true;
        startX = e.touches[0].clientX - translateX;
        startY = e.touches[0].clientY - translateY;
    }
});

lightboxContent.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        const currentDistance = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY
        );
        currentScale = Math.max(1, Math.min(initialScale * (currentDistance / initialDistance), 4));
        const el = getZoomableElement();
        el.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
        el.classList.toggle('zoomed', currentScale > 1);
    } else if (e.touches.length === 1 && isDragging) {
        const el = getZoomableElement();
        translateX = e.touches[0].clientX - startX;
        translateY = e.touches[0].clientY - startY;
        el.style.transform = `scale(${currentScale}) translate(${translateX}px, ${translateY}px)`;
    }
    e.preventDefault();
});

lightboxContent.addEventListener('touchend', () => {
    isDragging = false;
    if (currentScale <= 1) {
        translateX = 0;
        translateY = 0;
    }
});

document.querySelectorAll('.dashboard-card').forEach(card => {
    card.addEventListener('click', () => openDashboardModal(card.dataset.dashboard));
});

modalClose.addEventListener('click', closeDashboardModal);
modalOverlay.addEventListener('click', closeDashboardModal);

modalPrev.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex - 1 + currentDashboardMedia.length) % currentDashboardMedia.length;
    updateModalMainContent();
    updateThumbnails();
});

modalNext.addEventListener('click', () => {
    currentMediaIndex = (currentMediaIndex + 1) % currentDashboardMedia.length;
    updateModalMainContent();
    updateThumbnails();
});

function updateThumbnails() {
    modalThumbnails.querySelectorAll('img, video').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentMediaIndex);
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDashboardModal();
        closeLightbox();
    }
    if (modal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') modalPrev.click();
        if (e.key === 'ArrowRight') modalNext.click();
    }
    if (lightbox.classList.contains('active')) {
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
    }
});
