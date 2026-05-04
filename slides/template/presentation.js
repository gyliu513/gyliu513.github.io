/* ===========================================
   SLIDE PRESENTATION CONTROLLER
   =========================================== */
class SlidePresentation {
    constructor(talktrackData) {
        this.slides = document.querySelectorAll('.slide');
        this.currentIndex = 0;
        this.isAnimating = false;
        this.talktrack = Array.isArray(talktrackData) ? talktrackData : [];
        this.talktrackVisible = false;

        if (this.slides.length === 0) return;
        this.init();
    }

    init() {
        this.createNavDots();
        this.setupIntersectionObserver();
        this.bindEvents();
        this.updateProgress();
        this.updateSlideCounter();
        this.bindTalktrack();
    }

    createNavDots() {
        const nav = document.getElementById('navDots');
        if (!nav) return;
        this.slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => this.goToSlide(i));
            nav.appendChild(dot);
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.currentIndex = Array.from(this.slides).indexOf(entry.target);
                    this.updateNavDots();
                    this.updateProgress();
                    this.updateSlideCounter();
                    this.updateTalktrack();
                }
            });
        }, { threshold: 0.45 });

        this.slides.forEach(slide => observer.observe(slide));
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (['ArrowDown', 'ArrowRight', ' ', 'PageDown'].includes(e.key)) {
                e.preventDefault(); this.nextSlide();
            } else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key)) {
                e.preventDefault(); this.prevSlide();
            } else if (e.key === 'Home') {
                e.preventDefault(); this.goToSlide(0);
            } else if (e.key === 'End') {
                e.preventDefault(); this.goToSlide(this.slides.length - 1);
            } else if (e.key === 't' || e.key === 'T') {
                this.toggleTalktrack();
            } else if (e.key === 'Escape' && this.talktrackVisible) {
                this.toggleTalktrack(false);
            }
        });

        let touchStartY = 0;
        document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const diff = touchStartY - e.changedTouches[0].clientY;
            if (Math.abs(diff) > 50) diff > 0 ? this.nextSlide() : this.prevSlide();
        }, { passive: true });
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slides.length && !this.isAnimating) {
            this.isAnimating = true;
            this.slides[index].scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => { this.isAnimating = false; }, 600);
        }
    }

    nextSlide() { if (this.currentIndex < this.slides.length - 1) this.goToSlide(this.currentIndex + 1); }
    prevSlide() { if (this.currentIndex > 0) this.goToSlide(this.currentIndex - 1); }

    updateNavDots() {
        document.querySelectorAll('.nav-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }

    updateProgress() {
        const el = document.getElementById('progress');
        if (!el) return;
        el.style.width = `${((this.currentIndex + 1) / this.slides.length) * 100}%`;
    }

    updateSlideCounter() {
        const cur = document.getElementById('currentSlide');
        const tot = document.getElementById('totalSlides');
        if (cur) cur.textContent = String(this.currentIndex + 1).padStart(2, '0');
        if (tot) tot.textContent = String(this.slides.length).padStart(2, '0');
    }

    bindTalktrack() {
        const close = document.getElementById('talktrackClose');
        if (close) close.addEventListener('click', () => this.toggleTalktrack(false));
        this.updateTalktrack();
    }

    toggleTalktrack(forceState) {
        const el = document.getElementById('talktrack');
        if (!el) return;
        this.talktrackVisible = typeof forceState === 'boolean' ? forceState : !this.talktrackVisible;
        el.hidden = !this.talktrackVisible;
        if (this.talktrackVisible) this.updateTalktrack();
    }

    updateTalktrack() {
        const entry   = this.talktrack[this.currentIndex];
        const titleEl = document.getElementById('talktrackTitle');
        const notesEl = document.getElementById('talktrackNotes');
        const cueEl   = document.getElementById('talktrackCue');
        const slideEl = document.getElementById('talktrackSlide');

        if (titleEl) titleEl.textContent = entry ? entry.title : '';
        if (notesEl) notesEl.textContent = entry ? entry.notes : 'No notes for this slide.';
        if (cueEl)   { cueEl.textContent = entry?.cue || ''; cueEl.hidden = !entry?.cue; }
        if (slideEl) slideEl.textContent = `Slide ${this.currentIndex + 1} / ${this.slides.length}`;
    }
}
