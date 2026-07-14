document.addEventListener('DOMContentLoaded', () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // only animate once
            }
        });
    }, {
        threshold: 0.3 // triggers when 30% of the section is visible
    });

    document.querySelectorAll('.sec').forEach(sec => {
        observer.observe(sec);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const VISIBLE_COUNT = 3;
    const TRANSITION_MS = 600;
    const DEFAULT_INTERVAL = 4000;

    function initCarousel(mainEl) {
        const queue = Array.from(mainEl.querySelectorAll('.seci'));
        if (queue.length <= VISIBLE_COUNT) return; // nothing to rotate

        const interval = parseInt(mainEl.dataset.interval, 10) || DEFAULT_INTERVAL;
        let timer = null; // each .main keeps its own timer reference

        // hide everything beyond the first VISIBLE_COUNT initially
        queue.forEach((card, i) => {
            card.style.display = i < VISIBLE_COUNT ? '' : 'none';
        });

        function rotate() {
            const exiting = queue[0];
            exiting.classList.add('exit');

            setTimeout(() => {
                exiting.style.display = 'none';
                exiting.classList.remove('exit');

                queue.push(queue.shift());

                const entering = queue[VISIBLE_COUNT - 1];
                entering.style.display = '';
                entering.classList.add('enter-start');

                void entering.offsetWidth; // force reflow

                entering.classList.remove('enter-start');
                entering.classList.add('enter-active');

                setTimeout(() => {
                    entering.classList.remove('enter-active');
                }, TRANSITION_MS);

            }, TRANSITION_MS);
        }

        function start() {
            if (timer) return; // already running
            timer = setInterval(rotate, interval);
        }

        function stop() {
            clearInterval(timer);
            timer = null;
        }

        // this .main's own independent observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    start();
                } else {
                    stop();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(mainEl);
    }

    // each .main is initialized completely independently
    document.querySelectorAll('.main').forEach(mainEl => {
        initCarousel(mainEl);
    });
});