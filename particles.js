// Dense Vapor Particle System with Physics & Elements Repulsion
(function() {
    // 1. Inject Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width, height, particles = [];
    let uiRects = [];

    // Dynamically track bounding rects of main UI elements for physical repulsion
    function updateUIRects() {
        // Collect various cards and interactive blocks across the 4 apps
        const elements = document.querySelectorAll('.speaker-card, .step-card, .result-card, .prompt-card, .hero-left, .schedule-item, .timer-display, .info-block, .card-inner');
        uiRects = Array.from(elements).map(el => {
            const rect = el.getBoundingClientRect();
            return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width, height: rect.height };
        }).filter(r => r.width > 0 && r.height > 0);
    }

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        
        // Dense vapor calculation
        const particleCount = Math.floor((width * height) / 3200); 
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 2 + 1,
                vx: (Math.random() - 0.5) * 1,
                vy: (Math.random() - 0.5) * 1,
                baseAlpha: Math.random() * 0.4 + 0.1
            });
        }
        updateUIRects();
    }

    // Always keep tracking elements since they move with scroll and drag
    window.addEventListener('resize', initCanvas);
    window.addEventListener('scroll', updateUIRects);
    setInterval(updateUIRects, 100);

    function drawParticles() {
        // Slight clear to create trails / vapor blur effect
        ctx.fillStyle = 'rgba(10, 10, 10, 0.4)'; // matches the #111 or #0a0a0a dark aesthetic
        ctx.fillRect(0, 0, width, height);
        
        particles.forEach((p, index) => {
            // Apply subtle wind and upward vapor drift
            p.vx += (Math.random() - 0.5) * 0.08;
            p.vy += (Math.random() - 0.6) * 0.08; 

            // Air friction (damping)
            p.vx *= 0.96;
            p.vy *= 0.96;

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Screen wrapping to ensure viewport is always filled
            if (p.x < -20) p.x = width + 20;
            if (p.x > width + 20) p.x = -20;
            if (p.y < -20) p.y = height + 20;
            if (p.y > height + 20) p.y = -20;

            // ─── Physical Collision with UI Elements ───
            uiRects.forEach(rect => {
                const margin = 30; // Repulsion field radius
                if (p.x > rect.left - margin && p.x < rect.right + margin &&
                    p.y > rect.top - margin && p.y < rect.bottom + margin) {
                    
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    
                    const dx = p.x - cx;
                    const dy = p.y - cy;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    
                    if (dist > 0) {
                        const force = 300 / (dist * dist); 
                        p.vx += (dx / dist) * force;
                        p.vy += (dy / dist) * force;
                    }
                }
            });

            // Render individual particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(155, 109, 255, ${p.baseAlpha})`;
            ctx.fill();

            // ─── Cloud / Inter-particle physics ───
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distSq = dx*dx + dy*dy;
                
                if (distSq < 3500) { 
                    const dist = Math.sqrt(distSq);
                    
                    // Draw vapor web
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(155, 109, 255, ${0.18 - dist/400})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                    
                    // Particle collision (repulsion to simulate dense gas)
                    if (dist < 18) {
                        const force = 0.08;
                        p.vx += (dx/dist) * force;
                        p.vy += (dy/dist) * force;
                        p2.vx -= (dx/dist) * force;
                        p2.vy -= (dy/dist) * force;
                    }
                }
            }
        });
        requestAnimationFrame(drawParticles);
    }

    // Give the DOM a tiny bit of time to settle layout before init
    setTimeout(() => {
        initCanvas();
        drawParticles();
    }, 100);

})();
