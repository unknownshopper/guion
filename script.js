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

document.addEventListener('DOMContentLoaded', function() {
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