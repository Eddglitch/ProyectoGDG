const fs = require('fs');

const file = 'c:/Dev/Projects/ProyectoGDG/conference-app-static/index.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add view toggles to section-header
content = content.replace(
    '<span class="section-count">// 08 talks + lunch</span>',
    `<span class="section-count">// 08 talks + lunch</span>
            <div class="view-toggles">
                <button class="view-btn active" id="btn-view-cards" data-i18n="viewCards" aria-label="Card View">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="12" x2="21" y2="12"></line></svg>
                </button>
                <button class="view-btn" id="btn-view-calendar" data-i18n="viewCalendar" aria-label="Calendar View">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </button>
            </div>`
);

// 2. Add styles for toggles, calendar mode and actions
const styles = `
        /* ── CALENDAR VIEW & IO ANIMATIONS ── */
        .section-header { position: relative; display: flex; align-items: center; }
        .view-toggles { display: flex; gap: 8px; margin-left: auto; margin-right: 20px; }
        .view-btn { background: none; border: 1px solid var(--border); color: var(--gray); padding: 8px; cursor: pointer; border-radius: 8px; transition: 0.3s; }
        .view-btn.active { color: var(--accent); border-color: var(--accent); background: var(--surface); }
        .view-btn:hover { color: var(--white); border-color: var(--white); transform: translateY(-2px); }
        
        .timeline.calendar-mode { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 16px; padding: 24px 48px; background: var(--bg); border: none; }
        @media (max-width: 768px) { .timeline.calendar-mode { padding: 20px; grid-template-columns: 1fr; } }
        
        .timeline.calendar-mode .talk-card { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); }
        .timeline.calendar-mode .talk-card::after { width: 100%; height: 3px; transform: scaleX(0); transform-origin: left; top: 0; bottom: auto; }
        .timeline.calendar-mode .talk-card:hover::after { transform: scaleX(1); }
        .timeline.calendar-mode .talk-time-col { border-right: none; border-bottom: 1px solid var(--border); padding: 16px; flex-direction: row; justify-content: space-between; align-items: center; }
        .timeline.calendar-mode .talk-content { padding: 24px; flex: 1; display: flex; flex-direction: column; }
        .timeline.calendar-mode .talk-duration { margin-top: 0; }
        .timeline.calendar-mode .talk-speakers { margin-top: auto; padding-top: 20px; }

        .talk-actions { margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap; }
        .action-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 0.75rem; font-family: var(--mono); color: var(--white); border: 1px solid var(--border); background: var(--surface); padding: 6px 12px; border-radius: 20px; transition: 0.3s; cursor: pointer; text-decoration: none; }
        .action-btn:hover { background: var(--accent); border-color: var(--accent); color: var(--bg); transform: translateY(-2px); }
        
        .more-info-content { max-height: 0; overflow: hidden; transition: max-height 0.4s ease-out; font-size: 0.85rem; color: var(--gray); }
        .more-info-content.expanded { max-height: 400px; margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--border); }
        
        /* I/O 2026 Like Interactions */
        .hero-title { transform-style: preserve-3d; perspective: 1000px; }
        .hero-title em { display: inline-block; transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .hero-title:hover em { transform: rotateY(15deg) scale(1.05); text-shadow: 0 10px 30px rgba(155,109,255,0.6); }
        .pill, .speaker-chip, .hero-cta { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.3s, color 0.3s; }
        .pill:hover, .speaker-chip:hover { transform: translateY(-4px) scale(1.02); }
        
        .nav { transition: background 0.5s ease, backdrop-filter 0.5s ease; }
        .nav:hover { background: rgba(17,17,17,0.98); backdrop-filter: blur(24px); }
</style>`;
content = content.replace('</style>', styles);

// 3. Add actions and detailed info to each talk-card (except lunch)
const actionsHtml = `
                    <div class="talk-actions">
                        <a href="#" class="action-btn gcal-btn" target="_blank">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            <span data-i18n="addToCal">Add to Calendar</span>
                        </a>
                        <button class="action-btn more-info-btn">
                            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            <span data-i18n="moreInfo">More Info</span>
                        </button>
                    </div>
                    <div class="more-info-content">
                        <p style="margin-bottom:8px"><strong>Location:</strong> Stage Alpha</p>
                        <p>Detailed insights into the technical implementations, architecture decisions, and best practices directly from Google Cloud experts.</p>
                    </div>`;

// Substitute right before the speaker div, so it correctly formats inside the talk-content
// Ensure we don't mess up if there are no speakers
content = content.replace(/(<div class="talk-speakers">)/g, actionsHtml + '\n                    $1');

// 4. Update JS for translations and toggles
const transAddEn = `
                viewCards: "Card View",
                viewCalendar: "Calendar View",
                addToCal: "Add to Calendar",
                moreInfo: "More Info",
                footerText: "© 2026 · GDG Codelab · Exercise 02"`;
const transAddEs = `
                viewCards: "Vista Lista",
                viewCalendar: "Vista Calendario",
                addToCal: "Añadir a Calendario",
                moreInfo: "Más Info",
                footerText: "© 2026 · GDG Codelab · Ejercicio 02"`;

content = content.replace('footerText: "© 2026 · GDG Codelab · Exercise 02"', transAddEn);
content = content.replace('footerText: "© 2026 · GDG Codelab · Ejercicio 02"', transAddEs);

const jsAdditions = `
        // Setup View Toggles
        const btnCards = document.getElementById('btn-view-cards');
        const btnCal = document.getElementById('btn-view-calendar');
        const timeline = document.getElementById('timeline');
        
        if (btnCards && btnCal) {
            btnCards.addEventListener('click', () => {
                btnCards.classList.add('active');
                btnCal.classList.remove('active');
                timeline.classList.remove('calendar-mode');
            });
            btnCal.addEventListener('click', () => {
                btnCal.classList.add('active');
                btnCards.classList.remove('active');
                timeline.classList.add('calendar-mode');
            });
        }

        // Setup More Info Toggles
        document.querySelectorAll('.more-info-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const content = target.closest('.talk-content').querySelector('.more-info-content');
                if(!content) return;
                const isExpanded = content.classList.contains('expanded');
                
                content.classList.toggle('expanded');
                const span = target.querySelector('span');
                const activeLangBtn = document.querySelector('.lang-btn.active');
                const lang = activeLangBtn ? activeLangBtn.dataset.lang : 'en';
                
                if (!isExpanded) {
                    span.innerHTML = lang === 'es' ? 'Menos Info' : 'Less Info';
                    target.querySelector('svg').innerHTML = '<line x1="5" y1="12" x2="19" y2="12"></line>';
                } else {
                    span.innerHTML = lang === 'es' ? 'Más Info' : 'More Info';
                    target.querySelector('svg').innerHTML = '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>';
                }
            });
        });

        // Update GCAL Links
        document.querySelectorAll('.talk-card').forEach(card => {
            if(card.id === 'talk-LUNCH') return;
            const titleEl = card.querySelector('.talk-title');
            if(!titleEl) return;
            const title = encodeURIComponent(titleEl.innerText);
            const timeStr = card.querySelector('.talk-time').innerText; 
            const [h, m] = timeStr.split(':');
            const dateStr = '20260415T' + h + m + '00Z';
            const dateStrEnd = '20260415T' + (parseInt(h)+1).toString().padStart(2,'0') + m + '00Z';
            const btn = card.querySelector('.gcal-btn');
            if(btn) {
                btn.href = \`https://calendar.google.com/calendar/render?action=TEMPLATE&text=\${title}&dates=\${dateStr}/\${dateStrEnd}&location=Googleplex,+Mountain+View\`;
            }
        });
`;

content = content.replace('// Search & Filter', jsAdditions + '\n        // Search & Filter');

fs.writeFileSync(file, content);
console.log('Update successful');
