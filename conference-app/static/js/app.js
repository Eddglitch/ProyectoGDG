// app.js — Client-side search & filtering for the conference schedule

(function () {
    'use strict';

    const searchInput = document.getElementById('search-input');
    const searchClear = document.getElementById('search-clear');
    const filterPills = document.querySelectorAll('.pill[data-category]');
    const talkCards = document.querySelectorAll('.talk-card');
    const noResults = document.getElementById('no-results');
    const timeline = document.getElementById('timeline');

    let activeCategory = '';

    // --- Search & Filter Logic ---

    function filterTalks() {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        talkCards.forEach(card => {
            const talkId = card.dataset.talkId;

            // Always show lunch break if no search query
            if (talkId === 'LUNCH') {
                card.classList.toggle('hidden', query.length > 0);
                return;
            }

            const title = card.dataset.title || '';
            const speakers = card.dataset.speakers || '';
            const categories = card.dataset.categories || '';
            const description = card.querySelector('.talk-description')?.textContent.toLowerCase() || '';

            // Category filter
            let categoryMatch = true;
            if (activeCategory) {
                categoryMatch = categories.includes(activeCategory.toLowerCase());
            }

            // Text query filter
            let textMatch = true;
            if (query) {
                textMatch = title.includes(query) ||
                    speakers.includes(query) ||
                    description.includes(query);
            }

            const isVisible = categoryMatch && textMatch;
            card.classList.toggle('hidden', !isVisible);

            if (isVisible) visibleCount++;
        });

        // Show/hide no results message
        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }

        // Show/hide clear button
        if (searchClear) {
            searchClear.style.display = query.length > 0 ? 'flex' : 'none';
        }
    }

    // --- Event Listeners ---

    // Search input with debounce
    let debounceTimer;
    searchInput?.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(filterTalks, 200);
    });

    // Clear search
    searchClear?.addEventListener('click', () => {
        searchInput.value = '';
        filterTalks();
        searchInput.focus();
    });

    // Category filter pills
    filterPills.forEach(pill => {
        pill.addEventListener('click', () => {
            // Deactivate all pills
            filterPills.forEach(p => p.classList.remove('active'));
            // Activate clicked pill
            pill.classList.add('active');
            activeCategory = pill.dataset.category;
            filterTalks();
        });
    });

    // Keyboard shortcut: Escape to clear search
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            activeCategory = '';
            filterPills.forEach(p => p.classList.remove('active'));
            document.querySelector('.pill[data-category=""]')?.classList.add('active');
            filterTalks();
            searchInput.blur();
        }
        // '/' to focus search
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
    });

    // --- Smooth scroll for CTA ---
    document.getElementById('hero-cta')?.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById('schedule');
        if (target) {
            const searchBarHeight = document.querySelector('.search-section')?.offsetHeight || 0;
            const offset = target.getBoundingClientRect().top + window.scrollY - searchBarHeight - 20;
            window.scrollTo({ top: offset, behavior: 'smooth' });
        }
    });

    // --- Intersection Observer for card reveal ---
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        talkCards.forEach(card => {
            card.style.animationPlayState = 'paused';
            observer.observe(card);
        });
    }

})();
