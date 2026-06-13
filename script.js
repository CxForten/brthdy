document.addEventListener('DOMContentLoaded', () => {

    const targetDate = new Date("June 30, 2026 00:00:00").getTime();

    const countdown = setInterval(() => {

    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        / 1000
    );

    document.getElementById("countdown").innerHTML =
        `${days} días ${hours} horas ${minutes} min ${seconds} seg`;

    if(distance < 0){
        clearInterval(countdown);

        document.getElementById("countdown").innerHTML =
            "🎉 ¡Feliz cumpleaños! 🎉";

        const giftBtn = document.getElementById("giftButton");
        if (giftBtn) {
            giftBtn.classList.add('visible');
            // asegurar que sea accesible
            giftBtn.setAttribute('aria-hidden','false');
        }
    }

    }, 1000);
        // Generar carrusel dinámicamente a partir de una lista única de imágenes reales
    const content = document.getElementById("dailyContent");

    const today = new Date();

    // Mostrar mensaje especial el 11 de junio (y también el día anterior para vista previa)
    if (today.getMonth() === 5 && (today.getDate() === 5 || today.getDate() === 13)) {
        content.innerHTML = `
            <h2>Día 13</h2>
            <p>
                Ya faltan 17 días para su cumpelaños mi niña bella <br>
                Soy muy feliz de teneral en mi vida, y cada dia que la veo me pongo más y más feliz<br>
                Ya quiero que sea su cumpleaños para pasar otro año más con mi princesa<br>
                LA AMO Y AMARÉ ETERNAMENTE MI AMORCITO HERMOSO <3
            </p>
            <br>

            
            <div class="carousel" id="miniCarousel" aria-roledescription="carousel" tabindex="0">
                <div class="carousel-track"></div>
                <button class="carousel-btn prev" aria-label="Anterior">‹</button>
                <button class="carousel-btn next" aria-label="Siguiente">›</button>
                <div class="carousel-dots" role="tablist"></div>
            </div>
        `;

        // Lista conocida de imágenes (ajustada a los nombres reales en Photos/)
        const photos = [
            'photo 1.jpg','photo2.jpg','photo 3.jpg','photo 4.jpg','photo 5.jpg',
            'photo 6.jpg','photo 10.jpg','photo 11.jpg','photo 12.jpg','photo 13.jpg',
            'photo 14.jpg','photo 15.jpg','photo 16.jpg','photo 17.jpg','photo 18.jpg'
        ];

        // Extraer número para ordenar de forma natural; no num -> al final
        const extractNum = name => { const m = name.match(/(\d+)/); return m ? parseInt(m[0],10) : 9999; };
        photos.sort((a,b)=> extractNum(a) - extractNum(b));

        // Eliminar duplicados accidentalmente presentes
        const unique = Array.from(new Set(photos));

        const track = document.querySelector('#miniCarousel .carousel-track');
        unique.forEach(fname => {
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            const img = document.createElement('img');
            img.src = 'Photos/' + fname;
            img.alt = fname.replace(/\.jpg$/i,'');
            img.loading = 'lazy';
            img.onerror = function(){ this.src = 'Photos/amorcito-mejorado.jpg'; };
            slide.appendChild(img);
            track.appendChild(slide);
        });

        if (unique.length > 0) {
            setTimeout(initCarousel, 100);
        } else {
            console.warn('No hay imágenes para el carrusel');
        }
    }

    
   
    // Cuando el video de fondo esté listo, quitar preloader y animar entrada
    const bgVideo = document.getElementById('bg-video');
    const preloader = document.getElementById('preloader');

    const removePreloader = () => {
        document.body.classList.remove('site-loading');
        document.body.classList.add('site-loaded');
        if (preloader) preloader.style.opacity = '0';
        setTimeout(() => { if (preloader) preloader.remove(); }, 600);
    };

    // Si el video ya puede reproducirse visualmente
    if (bgVideo && bgVideo.readyState >= 3) {
        // already can play
        removePreloader();
    } else if (bgVideo) {
        // esperar al evento canplaythrough o timeout
        const onCanPlay = () => { removePreloader(); bgVideo.removeEventListener('canplaythrough', onCanPlay); };
        bgVideo.addEventListener('canplaythrough', onCanPlay);

        // fallback: 2.5s timeout
        setTimeout(() => { removePreloader(); }, 2500);
    } else {
        // sin video, quitar preloader pronto
        setTimeout(() => { removePreloader(); }, 500);
    }

    // Manejo de audio de fondo
    const bgAudio = document.getElementById('bg-audio');
    const audioToggle = document.getElementById('audioToggle');

    const fadeAudio = (audio, from, to, duration=800) => {
        const steps = 20;
        const stepTime = duration/steps;
        let current = from;
        audio.volume = Math.max(0, Math.min(1, from));
        const delta = (to - from)/steps;
        const i = setInterval(() => {
            current += delta;
            audio.volume = Math.max(0, Math.min(1, current));
            if ((delta>0 && current>=to) || (delta<0 && current<=to)) {
                clearInterval(i);
                audio.volume = Math.max(0, Math.min(1, to));
            }
        }, stepTime);
    };

    const tryPlayAudio = async () => {
        if (!bgAudio) return;
        bgAudio.volume = 0;
        bgAudio.loop = true;
        try {
            await bgAudio.play();
            // fade in
            fadeAudio(bgAudio, 0, 0.6, 1200);
            if (audioToggle) { audioToggle.style.display='none'; audioToggle.setAttribute('aria-pressed','true'); }
        } catch (e) {
            // autoplay blocked: show control so user inicie audio
            if (audioToggle) { audioToggle.style.display='block'; audioToggle.setAttribute('aria-pressed','false'); }
        }
    };

    if (bgAudio) {
        // intentamos reproducir inmediatamente
        tryPlayAudio();
    }

    if (audioToggle) {
        audioToggle.addEventListener('click', async () => {
            if (!bgAudio) return;
            if (bgAudio.paused) {
                try {
                    await bgAudio.play();
                    fadeAudio(bgAudio, 0, 0.6, 600);
                    audioToggle.setAttribute('aria-pressed','true');
                    audioToggle.textContent='🔊';
                } catch (e) {
                    console.warn('No se pudo reproducir audio:', e);
                }
            } else {
                fadeAudio(bgAudio, bgAudio.volume, 0, 500);
                setTimeout(()=>{ bgAudio.pause(); audioToggle.setAttribute('aria-pressed','false'); audioToggle.textContent='🔈'; }, 550);
            }
        });
    }

});

// --- CARRUSEL ---
function initCarousel(){
    const carousel = document.getElementById('miniCarousel');
    if (!carousel) return;
    const track = carousel.querySelector('.carousel-track');
    const slides = Array.from(track.querySelectorAll('.carousel-slide'));
    const prevBtn = carousel.querySelector('.carousel-btn.prev');
    const nextBtn = carousel.querySelector('.carousel-btn.next');
    const dotsWrap = carousel.querySelector('.carousel-dots');

    let current = 0;
    let autoplayInterval = null;
    const slideCount = slides.length;

    slides.forEach((s, i) => {
        const dot = document.createElement('button');
        dot.className = 'dot';
        dot.setAttribute('aria-label', 'Ir a imagen ' + (i+1));
        dot.addEventListener('click', () => { goTo(i); resetAutoplay(); });
        dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));

    function update(){
        const offset = -current * 100;
        track.style.transform = `translateX(${offset}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i===current));
    }

    function goTo(idx){ current = (idx + slideCount) % slideCount; update(); }
    function next(){ goTo(current+1); }
    function prev(){ goTo(current-1); }

    nextBtn.addEventListener('click', ()=>{ next(); resetAutoplay(); });
    prevBtn.addEventListener('click', ()=>{ prev(); resetAutoplay(); });

    function startAutoplay(){ autoplayInterval = setInterval(()=>{ next(); }, 3600); }
    function stopAutoplay(){ if (autoplayInterval) { clearInterval(autoplayInterval); autoplayInterval = null; } }
    function resetAutoplay(){ stopAutoplay(); startAutoplay(); }

    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);

    // swipe support
    let startX=0, isDown=false, lastTranslate=0;
    const threshold=100;
    carousel.addEventListener('touchstart', (e)=>{ isDown=true; startX = e.touches[0].clientX; stopAutoplay(); lastTranslate = -current * carousel.offsetWidth; });
    carousel.addEventListener('touchmove', (e)=>{ if(!isDown) return; const dx = e.touches[0].clientX - startX; track.style.transition='none'; track.style.transform = `translateX(${lastTranslate + dx}px)`; });
    carousel.addEventListener('touchend', (e)=>{ if(!isDown) return; isDown=false; const dx = e.changedTouches[0].clientX - startX; track.style.transition=''; if (dx > threshold) prev(); else if (dx < -threshold) next(); else update(); startAutoplay(); });

    carousel.addEventListener('keydown', (e)=>{ if (e.key==='ArrowLeft') prev(); if (e.key==='ArrowRight') next(); });

    goTo(0); startAutoplay();
}