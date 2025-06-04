// Function to show episodes for selected season
function showSeason(seasonNumber) {
    const episodesList = document.getElementById('episodios-lista');
    if (!episodesList) return;
    
    // Hide all episodes first
    const allEpisodes = episodesList.querySelectorAll('li');
    allEpisodes.forEach(episode => {
        episode.style.display = 'none';
    });
    
    // Show episodes for selected season
    const seasonEpisodes = episodesList.querySelectorAll(`li[data-season="${seasonNumber}"]`);
    seasonEpisodes.forEach(episode => {
        episode.style.display = 'block';
    });
}

// Función para aplicar el efecto de resaltado de letras
function setupLetterHighlighting() {
    const elements = document.querySelectorAll('.ep01');
    
    elements.forEach(element => {
        // Solo procesar si no se ha procesado antes
        if (element.dataset.processed !== 'true') {
            const text = element.textContent;
            let html = '';
            
            // Crear un span para cada letra
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                // Si es un espacio, mantenerlo como está
                if (char === ' ') {
                    html += ' ';
                } else {
                    html += `<span class="letter" style="--delay: ${i * 0.05}s">${char}</span>`;
                }
            }
            
            // Reemplazar el contenido con los spans
            element.innerHTML = html;
            element.dataset.processed = 'true';
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    setupLetterHighlighting();
    
    // Reiniciar la animación al hacer clic
    document.addEventListener('click', function() {
        const letters = document.querySelectorAll('.letter');
        letters.forEach(letter => {
            // Reiniciar la animación
            letter.style.animation = 'none';
            void letter.offsetHeight; // Forzar reflow
            letter.style.animation = '';
        });
    });
    
    const seasonSelect = document.getElementById('temporada');
    const episodesList = document.getElementById('episodios-lista');
    
    // Verificar si los elementos existen antes de continuar
    if (seasonSelect && episodesList) {
        // Add event listener for season selection change
        seasonSelect.addEventListener('change', function() {
            const selectedSeason = this.value;
            showSeason(selectedSeason);
        });
        
        // Show first season by default
        showSeason(seasonSelect.value);
    }
    
    // Prevent default behavior for "Próximamente" links
    const proximamenteLinks = document.querySelectorAll('.proximamente');
    if (proximamenteLinks.length > 0) {
        proximamenteLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                alert('¡Próximamente! Este episodio estará disponible pronto.');
            });
        });
    }
});