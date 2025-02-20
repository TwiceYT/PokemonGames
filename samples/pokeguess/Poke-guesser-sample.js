const pokemonList = {
    "pikachu": { type: "Electric", generation: 1, height: 0.4, weight: 6, color: "Yellow" },
    "charmander": { type: "Fire", generation: 1, height: 0.6, weight: 8.5, color: "Orange" },
    "bulbasaur": { type: "Grass", generation: 1, height: 0.7, weight: 6.9, color: "Green" },
    "squirtle": { type: "Water", generation: 1, height: 0.5, weight: 9, color: "Blue" }
};

let targetPokemon = "pikachu"; // Change this for different rounds

function checkGuess() {
    let userGuess = document.getElementById("guessInput").value.toLowerCase();
    
    if (!(userGuess in pokemonList)) {
        alert("Invalid Pokémon. Try again!");
        return;
    }

    let guessedPokemon = pokemonList[userGuess];
    let correctPokemon = pokemonList[targetPokemon];

    addNewGuessRow(guessedPokemon, correctPokemon);
}

function addNewGuessRow(guessedPokemon, correctPokemon) {
    let tableBody = document.querySelector("#guessTable tbody");
    let newRow = tableBody.insertRow(0); // Inserts at the top

    newRow.innerHTML = `
        <td class="${getClass(guessedPokemon.type, correctPokemon.type)}">${guessedPokemon.type}</td>
        <td class="${getClass(guessedPokemon.generation, correctPokemon.generation)}">${guessedPokemon.generation}</td>
        <td class="${getClass(guessedPokemon.height, correctPokemon.height)}">${guessedPokemon.height}</td>
        <td class="${getClass(guessedPokemon.weight, correctPokemon.weight)}">${guessedPokemon.weight}</td>
        <td class="${getClass(guessedPokemon.color, correctPokemon.color)}">${guessedPokemon.color}</td>
    `;
}

function getClass(guessedValue, correctValue) {
    return guessedValue === correctValue ? "correct" : "wrong";
}

let allPokemon = []; // Stores all Pokémon names

// Fetch all Pokémon names (1-898)
async function fetchAllPokemon() {
    try {
        let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=898");
        let data = await response.json();
        allPokemon = data.results.map(p => p.name);
    } catch (error) {
        console.error("Error fetching Pokémon list:", error);
    }
}

// Call function to fetch all Pokémon names on page load
fetchAllPokemon();

// Handle input suggestions
document.getElementById("guessInput").addEventListener("input", function () {
    let inputValue = this.value.toLowerCase();
    let suggestionsContainer = document.getElementById("suggestions");
    suggestionsContainer.innerHTML = ""; // Clear old suggestions

    if (inputValue.length === 0) {
        suggestionsContainer.style.display = "none"; // Hide if no input
        return;
    }

    let filteredPokemon = allPokemon.filter(pokemon => pokemon.startsWith(inputValue)).slice(0, 5); // Max 5 suggestions

    filteredPokemon.forEach(async (pokemon) => {
        let suggestionItem = document.createElement("div");
        suggestionItem.classList.add("suggestion");

        // Fetch Pokémon sprite (icon)
        let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        let pokemonData = await pokemonResponse.json();
        let pokemonImage = pokemonData.sprites.front_default;

        // Create image element
        let img = document.createElement("img");
        img.src = pokemonImage;
        img.classList.add("pokemon-icon");

        suggestionItem.appendChild(img);
        suggestionItem.appendChild(document.createTextNode(pokemon));

        // When clicked, insert into input & hide suggestions
        suggestionItem.onclick = function () {
            document.getElementById("guessInput").value = pokemon;
            suggestionsContainer.style.display = "none";
        };

        suggestionsContainer.appendChild(suggestionItem);
    });

    suggestionsContainer.style.display = "block"; // Show suggestions
});
