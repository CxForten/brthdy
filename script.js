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

    const content = document.getElementById("dailyContent");

    const today = new Date();

    if (today.getDate() >= 0 && today.getDate() < 10) {
        content.innerHTML = `
            <h2>❤️ Día 1</h2>
            <p>
                Este es el comienzo de algo especial.
                Cada día habrá una pequeña sorpresa esperándote.
            </p>
        `;
    }

    else if (today.getDate() >= 10 && today.getDate() < 20) {
        content.innerHTML = `
            <h2>📸 Un recuerdo</h2>

            <img src="foto1.jpg"
                 style="max-width:500px;border-radius:15px;">

            <p>
                Una de mis fotos favoritas contigo.
            </p>
        `;
    }

    else if (today.getDate() >= 20 && today.getDate() < 30) {
        content.innerHTML = `
            <h2>🎥 Algo para ti</h2>

            <video width="500" controls>
                <source src="video.mp4" type="video/mp4">
            </video>

            <p>
                Ya falta muy poco...
            </p>
        `;
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