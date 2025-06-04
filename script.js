document.addEventListener('DOMContentLoaded', function() {
    const seasonSelect = document.getElementById('temporada');
    const episodesList = document.getElementById('episodios-lista');
    
    // Function to show episodes for selected season
    function showSeason(seasonNumber) {
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
    
    // Add event listener for season selection change
    seasonSelect.addEventListener('change', function() {
        const selectedSeason = this.value;
        showSeason(selectedSeason);
    });
    
    // Prevent default behavior for "Próximamente" links
    document.querySelectorAll('.proximamente').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('¡Próximamente! Este episodio estará disponible pronto.');
        });
    });
    
    // Show first season by default
    showSeason(1);
});