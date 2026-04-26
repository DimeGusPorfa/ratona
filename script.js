// --- CONFIGURACIÓN DE LAS FOTOS ---
// Aquí puedes poner los enlaces (URLs) de tus propias fotos.
// La propiedad 'rot' es la rotación inicial de la foto (en grados) para darle el efecto desordenado.
// Nombres exactos de las fotos que tienes en tu carpeta 'img'
const nombresFotos = [
    "1.JPG", "2.JPG", "3.JPG", "4.JPG", "5.JPG", "6.JPG", "7.JPG", "8.JPG",
    "9.JPG", "10.JPG", "11.JPG", "12.JPG", "13.JPG", "14.JPG", "15.JPG",
    "16.JPG", "17.JPG", "18.JPG", "19.JPG", "20.JPG", "21.JPG", "22.JPG",
    "23.JPG", "24.JPG", "25.JPG", "26.JPG", "27.JPG", "28.JPG", "29.JPG",
    "30.jpg", "31.JPG", "32.JPG"
];

// Generamos el arreglo de fotos automáticamente
let fotos = nombresFotos.map((nombre, index) => {
    // Generamos una rotación aleatoria entre -5 y 5 grados para dar ese efecto de "tiradas en la mesa"
    let rotacionAleatoria = Math.floor(Math.random() * 11) - 5;
    return {
        id: index + 1,
        url: `img/${nombre}`,
        rot: rotacionAleatoria
    };
});

// Variable para evitar que el usuario dé múltiples clicks rápidos y rompa la animación
let isAnimating = false;

// --- INICIALIZACIÓN ---
// Este evento asegura que el código JavaScript se ejecute solo cuando el HTML haya cargado completamente.
document.addEventListener('DOMContentLoaded', () => {
    generarCorazonesDeFondo();
    renderizarCartas();
});

// --- FUNCIÓN: GENERAR CORAZONES DE FONDO ---
// Crea elementos div con forma de corazón y los anima subiendo por la pantalla
function generarCorazonesDeFondo() {
    const contenedor = document.getElementById('hearts-container');
    const numeroDeCorazones = 15;

    // Código SVG (vectorial) de un corazón
    const heartSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
    `;

    for (let i = 0; i < numeroDeCorazones; i++) {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = heartSVG;

        // Valores aleatorios para que cada corazón sea único y orgánico
        const left = Math.random() * 100; // Posición horizontal aleatoria (0% a 100%)
        const animationDuration = 15 + Math.random() * 20; // Duración de subida de 15s a 35s
        const animationDelay = Math.random() * 10; // Retraso antes de empezar (0s a 10s)
        const size = 10 + Math.random() * 20; // Tamaño variable entre 10px y 30px
        const opacity = 0.1 + Math.random() * 0.3; // Transparencia variable (0.1 a 0.4)

        // Aplicamos los estilos calculados al corazón
        heart.style.left = `${left}%`;
        heart.style.animationDuration = `${animationDuration}s`;
        heart.style.animationDelay = `${animationDelay}s`;
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.setProperty('--target-opacity', opacity); // Usado en la animación CSS

        contenedor.appendChild(heart);
    }
}

// --- FUNCIÓN: RENDERIZAR LAS CARTAS (FOTOS) ---
// Dibuja las fotos en la pantalla en forma de mazo apilado
function renderizarCartas() {
    const contenedor = document.getElementById('cards-container');
    contenedor.innerHTML = ''; // Limpiamos el contenedor por si había cartas previas

    // Icono SVG pequeño para el botón "Siguiente" que pulsa
    const smallHeartSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#ec4899" stroke="#ec4899" stroke-width="2" class="animate-pulse-heart">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
    `;

    // Recorremos nuestro arreglo de fotos
    fotos.forEach((foto, index) => {
        const isTop = index === 0; // Verifica si es la primera carta (la que está hasta arriba)

        // Creamos el elemento contenedor de la carta
        const card = document.createElement('div');
        card.classList.add('foto-card');
        
        // Si es la carta superior, le agregamos la clase 'top-card' y el evento para escuchar clicks
        if (isTop) {
            card.classList.add('top-card');
            card.addEventListener('click', () => manejarClickCarta(card));
        }

        // Lógica visual para apilar las cartas (dar profundidad)
        const offset = index * 8; // Distancia hacia abajo y la derecha entre cartas (8px, 16px, 24px...)
        const scale = 1 - (index * 0.04); // Hacer las cartas de atrás progresivamente más pequeñas

        // Calculamos los estilos de transformación (posición, rotación, escala)
        let transformStyle = '';
        if (isTop) {
            // La carta principal de arriba no tiene offset y está derecha
            transformStyle = `translate(0px, 0px) rotate(0deg) scale(1)`;
        } else {
            // Las cartas del fondo aplican su rotación original, su posición (offset) y tamaño (scale)
            transformStyle = `translate(${offset}px, ${offset}px) rotate(${foto.rot}deg) scale(${scale})`;
        }

        // Aplicamos los estilos calculados
        card.style.transform = transformStyle;
        card.style.zIndex = 50 - index; // Z-Index controla qué elemento se dibuja encima (el 0 tiene z-index 50)
        card.style.opacity = index > 4 ? 0 : 1; // Ocultar cartas que están demasiado al fondo para no saturar

        // Inyectamos la imagen y el botón (el botón solo en la carta superior)
        card.innerHTML = `
            <img src="${foto.url}" alt="Recuerdo nuestro" class="w-full h-full object-cover pointer-events-none" />
            ${isTop ? `<div class="btn-siguiente">Siguiente ${smallHeartSVG}</div>` : ''}
        `;

        contenedor.appendChild(card);
    });
}

// --- FUNCIÓN: MANEJAR EL CLICK EN LA CARTA ---
// Controla la animación de deslizar la carta hacia atrás (estilo Tinder)
function manejarClickCarta(cardElement) {
    if (isAnimating) return; // Evita que la función corra si ya hay una animación en curso
    
    isAnimating = true; // Bloqueamos nuevas animaciones

    // 1. Decidir aleatoriamente si el swipe será a la derecha o a la izquierda
    const direccion = Math.random() > 0.5 ? 'animating-out-right' : 'animating-out-left';
    cardElement.classList.add(direccion);

    // 2. Crear la explosión de corazoncitos
    crearExplosionCorazones();

    // 3. Esperamos a que termine la animación visual de la carta en CSS (400 milisegundos)
    setTimeout(() => {
        // Modificamos el arreglo de datos: quitamos la primera foto del inicio y la empujamos al final
        const primeraFoto = fotos.shift(); 
        fotos.push(primeraFoto);

        // Volvemos a dibujar todas las cartas con el nuevo orden del arreglo
        renderizarCartas();
        
        // Liberamos el bloqueo para permitir nuevos clicks
        isAnimating = false;
    }, 400); // Este tiempo (400ms) debe coincidir exactamente con el "transition: all 400ms" de styles.css
}

// --- FUNCIÓN: EXPLOSIÓN DE CORAZONCITOS AL DAR CLICK ---
function crearExplosionCorazones() {
    const contenedor = document.getElementById('cards-container');
    const numeroCorazones = 8; // Cuántos corazones saldrán por click

    const heartSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
        </svg>
    `;

    for (let i = 0; i < numeroCorazones; i++) {
        const heart = document.createElement('div');
        heart.classList.add('burst-heart');
        heart.innerHTML = heartSVG;

        // Calcular dirección aleatoria para la explosión (ángulo en radianes)
        const angle = Math.random() * Math.PI * 2;
        const velocity = 80 + Math.random() * 120; // Distancia en pixeles que volará
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const rot = Math.random() * 360 - 180; // Rotación aleatoria

        // Establecemos las variables CSS para la animación
        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);
        heart.style.setProperty('--rot', `${rot}deg`);

        contenedor.appendChild(heart);

        // Limpiamos el DOM eliminando el corazón una vez que termine su animación (600ms)
        setTimeout(() => {
            heart.remove();
        }, 600);
    }
}
