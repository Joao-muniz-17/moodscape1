document.addEventListener('DOMContentLoaded', () => {
    // --- Seletores do DOM ---
    const moodButtons = document.querySelectorAll('.mood-btn');
    const body = document.body;
    const quoteTextElem = document.getElementById('quote-text');
    const quoteAuthorElem = document.getElementById('quote-author');
    const canvas = document.getElementById('animation-canvas');
    const ctx = canvas.getContext('2d');

    // --- Banco de Dados de Frases (Array Local) ---
    const quotes = {
        feliz: [
            { text: "A alegria está na luta, na tentativa, no sofrimento envolvido e não na vitória propriamente dita.", author: "Mahatma Gandhi" },
            { text: "Espalhe o amor por onde você for. Não deixe ninguém vir a você sem sair mais feliz.", author: "Madre Teresa" },
        ],
        calmo: [
            { text: "A paz vem de dentro. Não a procure à sua volta.", author: "Buda" },
            { text: "Adote o ritmo da natureza: o segredo dela é a paciência.", author: "Ralph Waldo Emerson" },
        ],
        estressado: [
            { text: "Dentro de você há uma calmaria e um santuário para o qual pode se retirar a qualquer momento e ser você mesmo.", author: "Hermann Hesse" },
            { text: "A maior arma contra o estresse é nossa capacidade de escolher um pensamento em vez de outro.", author: "William James" },
        ],
        criativo: [
            { text: "A criatividade é a inteligência se divertindo.", author: "Albert Einstein" },
            { text: "Você não pode esgotar a criatividade. Quanto mais você usa, mais você tem.", author: "Maya Angelou" },
        ],
        energetico: [
            { text: "A energia e a persistência conquistam todas as coisas.", author: "Benjamin Franklin" },
            { text: "Eu sou uma parte de tudo aquilo que encontrei no meu caminho.", author: "Alfred Tennyson" },
        ]
    };

    let currentMood = 'calmo';
    let animationFrameId;

    // --- Funções Principais ---

    /**
     * Define o tema e atualiza todo o conteúdo da página.
     * @param {string} mood - O humor selecionado (ex: 'feliz').
     */
    function setTheme(mood) {
        currentMood = mood;

        // 1. Atualiza o atributo data-theme no body para trocar o CSS
        body.dataset.theme = mood;
        
        // 2. Remove classes de animação anteriores
        body.classList.remove('vibrate', 'pulse');

        // 3. Atualiza o botão ativo
        moodButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mood === mood);
        });

        // 4. Atualiza a frase
        updateQuote(mood);

        // 5. Inicia a animação correta
        handleAnimations(mood);
        
        // 6. Salva no LocalStorage
        saveMoodToLocalStorage(mood);
    }

    /**
     * Atualiza o texto da citação na tela.
     * @param {string} mood - O humor atual.
     */
    function updateQuote(mood) {
        const moodQuotes = quotes[mood];
        if (moodQuotes) {
            const randomIndex = Math.floor(Math.random() * moodQuotes.length);
            const randomQuote = moodQuotes[randomIndex];
            
            // Adiciona animação de fade-in
            quoteTextElem.parentElement.style.animation = 'none';
            void quoteTextElem.parentElement.offsetWidth; // Reflow para reiniciar a animação
            quoteTextElem.parentElement.style.animation = 'fade-in 1s forwards ease-out';
            
            quoteTextElem.textContent = `"${randomQuote.text}"`;
            quoteAuthorElem.textContent = randomQuote.author;
        }
    }

    /**
     * Salva o último humor selecionado no LocalStorage.
     * @param {string} mood - O humor para salvar.
     */
    function saveMoodToLocalStorage(mood) {
        localStorage.setItem('userMood', mood);
    }

    /**
     * Carrega o humor salvo do LocalStorage ao iniciar a página.
     */
    function loadMoodFromLocalStorage() {
        const savedMood = localStorage.getItem('userMood');
        setTheme(savedMood || 'calmo'); // Usa 'calmo' como padrão
    }

    // --- Gerenciamento de Animações ---

    function handleAnimations(mood) {
        // Para qualquer animação em andamento e limpa o canvas
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Aplica animações baseadas em CSS
        if (mood === 'estressado') {
            body.classList.add('vibrate');
        } else if (mood === 'energetico') {
            body.classList.add('pulse');
        }

        // Inicia animações baseadas em Canvas
        if (mood === 'feliz') {
            startConfetti();
        } else if (mood === 'calmo') {
            startWaves();
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // --- Lógica das Animações de Canvas ---

    // Animação de Confetes (Feliz)
    let confettiParticles = [];
    function startConfetti() {
        confettiParticles = [];
        for (let i = 0; i < 100; i++) {
            confettiParticles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                r: Math.random() * 4 + 1, // Raio
                d: Math.random() * 100 + 1, // Densidade
                color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`,
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngle: 0
            });
        }
        animateConfetti();
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiParticles.forEach((p, i) => {
            p.y += Math.cos(p.d + i) + 1 + p.r / 2;
            p.x += Math.sin(p.tiltAngle);
            p.tiltAngle += p.tilt / 200;

            if (p.y > canvas.height) {
                // Reinicia partícula no topo
                p.x = Math.random() * canvas.width;
                p.y = -20;
            }
            // Desenha a partícula
            ctx.beginPath();
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
            ctx.fill();
        });
        animationFrameId = requestAnimationFrame(animateConfetti);
    }
    
    // Animação de Ondas (Calmo)
    let waveAngle = 0;
    function startWaves() {
        animateWaves();
    }

    function animateWaves() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        
        for (let i = -2; i < 3; i++) {
            ctx.beginPath();
            for (let x = 0; x < canvas.width; x++) {
                let y = Math.sin(x * 0.01 + waveAngle + i * 0.5) * 20 + canvas.height / 2 + i * 60;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        waveAngle += 0.02;
        animationFrameId = requestAnimationFrame(animateWaves);
    }
    
    // --- Event Listeners ---
    
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mood = button.dataset.mood;
            setTheme(mood);
        });
    });

    window.addEventListener('resize', () => {
        resizeCanvas();
        // Reinicia a animação atual para se adaptar ao novo tamanho
        handleAnimations(currentMood); 
    });

    // --- Inicialização ---
    resizeCanvas();
    loadMoodFromLocalStorage();
});
