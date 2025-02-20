let targetPokemon = {}; // Global variable to store the Pokémon to guess
let allPokemon = [];

async function fetchAllPokemon() {
    try {
        let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=898");
        let data = await response.json();
        allPokemon = data.results.map(p => p.name);
    } catch (error) {
        console.error("Error fetching Pokémon list:", error);
    }
}

async function fetchRandomPokemon() {
    let randomId = Math.floor(Math.random() * 898) + 1; // Pokémon IDs range from 1 to 898

    try {
        // Fetch Pokémon data
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        let pokemonData = await response.json();

        // Fetch additional details (species data)
        let speciesResponse = await fetch(pokemonData.species.url);
        let speciesData = await speciesResponse.json();

        // Fetch generation info
        let generationResponse = await fetch(speciesData.generation.url);
        let generationData = await generationResponse.json();

        // Extract Pokémon details
        targetPokemon = {
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
            type1: pokemonData.types[0]?.type.name || "None",
            type2: pokemonData.types[1]?.type.name || "None",
            generation: generationData.name.replace("generation-", "").toUpperCase(),
            color: speciesData.color.name,
            habitat: speciesData.habitat ? speciesData.habitat.name : "Unknown"
        };

        console.log("Target Pokémon:", targetPokemon); // Debugging
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
    }
}

// Function to check the user's guess
function checkGuess() {
    let userGuess = document.getElementById("guessInput").value.toLowerCase();

    fetch(`https://pokeapi.co/api/v2/pokemon/${userGuess}`)
        .then(response => {
            if (!response.ok) {
                alert("Invalid Pokémon. Try again!");
                throw new Error("Invalid Pokémon");
            }
            return response.json();
        })
        .then(pokemonData => fetch(pokemonData.species.url)) // Fetch species data
        .then(response => response.json())
        .then(speciesData => fetch(speciesData.generation.url)) // Fetch generation data
        .then(response => response.json())
        .then(generationData => {
            let guessedPokemon = {
                name: userGuess,
                image: pokemonData.sprites.front_default,
                type1: pokemonData.types[0]?.type.name || "None",
                type2: pokemonData.types[1]?.type.name || "None",
                generation: generationData.name.replace("generation-", "").toUpperCase(),
                color: speciesData.color.name,
                habitat: speciesData.habitat ? speciesData.habitat.name : "Unknown"
            };

            updatePokemonTable(guessedPokemon);
        })
        .catch(error => console.error("Error fetching guess:", error));
}

// Function to update the table with guessed Pokémon data
function updatePokemonTable(guessedPokemon) {
    let tableBody = document.getElementById("pokemonTableBody");
    let row = document.createElement("tr");

    function checkMatch(value, correctValue) {
        return value === correctValue ? "✅" : "❌";
    }

    row.innerHTML = `
        <td><img src="${guessedPokemon.image}" alt="${guessedPokemon.name}" class="pokemon-img"></td>
        <td>${guessedPokemon.name}</td>
        <td>${guessedPokemon.generation} ${checkMatch(guessedPokemon.generation, targetPokemon.generation)}</td>
        <td>${guessedPokemon.type1} ${checkMatch(guessedPokemon.type1, targetPokemon.type1)}</td>
        <td>${guessedPokemon.type2} ${checkMatch(guessedPokemon.type2, targetPokemon.type2)}</td>
        <td>${guessedPokemon.color} ${checkMatch(guessedPokemon.color, targetPokemon.color)}</td>
        <td>${guessedPokemon.habitat} ${checkMatch(guessedPokemon.habitat, targetPokemon.habitat)}</td>
    `;

    tableBody.appendChild(row);
}

function showSuggestions() {
    let inputValue = document.getElementById("guessInput").value.toLowerCase();
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
}

// Attach the function to the input field
document.getElementById("guessInput").addEventListener("input", showSuggestions);


fetchRandomPokemon();
fetchAllPokemon();