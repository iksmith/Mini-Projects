// Front End Functionalities


// Handling the search form submission
$('#searchBtn').click(function() {
    const gameTitle = $('#searchInput').val();
    if (gameTitle) {
        fetch(`/search-games?title=${encodeURIComponent(gameTitle)}`)
        .then(res => res.json())
        .then(games => displayGames(games))
        .catch(err => console.error(`Error fetching games:`, err));
    } else {
        alert('Please enter a game title');
    }
});

function displayGames(games) {
    const resultsContainer = $('#gameResults');
    if (games.length > 0) {
        resultsContainer.html(games.map(game =>
            `<div><h4>${game.name}</h4><img src="${game.cover}" alt="Cover Art for ${game.name}" style="width: 100px; height: auto;"></div>`
        ).join(''));
    } else {
        resultsContainer.html('<p>No games found. Please try a different search.</p>');
    }
}

// Debouncing the search input
const searchInput = document.getElementById('searchInput');
let debounceTimeout;

searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const searchText = searchInput.value.trim();
        if (searchText) {
            fetch(`/search-games?title=${encodeURIComponent(searchText)}`)
                .then(response => response.json())
                .then(games => displayGames(games))
                .catch(err => console.error(`Error fetching games:`, err));
        } else {
            document.getElementById('gameResults').innerHTML = '';
        }
    }, 300); // Wait for 300 ms after the user stops typing
});

function displayGames(games) {
    const resultsContainer = document.getElementById('gameResults');
    if (games.length > 0) {
        resultsContainer.innerHTML = games.map(game =>
            `<div><h4>${game.name}</h4><img src="${game.cover}" alt="Cover Art for ${game.name}" style="width: 100px; height: auto;"></div>`
        ).join('');
    } else {
        resultsContainer.innerHTML = '<p>No games found. Please try a different search.</p>';
    }
}