let targetPokemon = {}; // Global variable to store the Pokémon to guess
let allPokemon = [];
var Guesses = 0;

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
    let guessedPokemon = {}; // Define outside the chain
    var Guesses = Guesses + 1;

    fetch(`https://pokeapi.co/api/v2/pokemon/${userGuess}`)
        .then(response => {
            if (!response.ok) {
                alert("Invalid Pokémon. Try again!");
                throw new Error("Invalid Pokémon");
            }
            return response.json();
        })
        .then(data => {
            guessedPokemon.image = data.sprites.front_default;
            guessedPokemon.type1 = data.types[0]?.type.name || "None";
            guessedPokemon.type2 = data.types[1]?.type.name || "None";
            return fetch(data.species.url); // Fetch species data
        })
        .then(response => response.json())
        .then(speciesData => {
            guessedPokemon.color = speciesData.color.name;
            guessedPokemon.habitat = speciesData.habitat ? speciesData.habitat.name : "Unknown";
            return fetch(speciesData.generation.url); // Fetch generation data
        })
        .then(response => response.json())
        .then(generationData => {
            guessedPokemon.name = userGuess;
            guessedPokemon.generation = generationData.name.replace("generation-", "").toUpperCase();

            updatePokemonTable(guessedPokemon);
        })
        .catch(error => console.error("Error fetching guess:", error));
}



// Function to update the table with guessed Pokémon data
function updatePokemonTable(guessedPokemon) {
    let tableBody = document.getElementById("pokemonTableBody");
    let row = document.createElement("tr");

    function checkMatch(value, correctValue) {
        return value === correctValue ? "correct" : "wrong";
    }

    row.innerHTML = `
        <td><img src="${guessedPokemon.image}" alt="${guessedPokemon.name}" class="pokemon-table-icon"></td>
        <td>${guessedPokemon.name}</td>
        <td class="${checkMatch(guessedPokemon.generation, targetPokemon.generation)}">${guessedPokemon.generation}</td>
        <td class="${checkMatch(guessedPokemon.type1, targetPokemon.type1)}">${guessedPokemon.type1}</td>
        <td class="${checkMatch(guessedPokemon.type2, targetPokemon.type2)}">${guessedPokemon.type2}</td>
        <td class="${checkMatch(guessedPokemon.color, targetPokemon.color)}">${guessedPokemon.color}</td>
        <td class="${checkMatch(guessedPokemon.habitat, targetPokemon.habitat)}">${guessedPokemon.habitat}</td>
    `;

    tableBody.prepend(row);
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

        let pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        let pokemonData = await pokemonResponse.json();
        let pokemonImage = pokemonData.sprites.front_default;

        let img = document.createElement("img");
        img.src = pokemonImage;
        img.classList.add("pokemon-icon");

        suggestionItem.appendChild(img);
        suggestionItem.appendChild(document.createTextNode(pokemon));

        // When clicked, insert into input & hide suggestions
        suggestionItem.onclick = function () {
            console.log("Suggestion clicked:", pokemon);
            document.getElementById("guessInput").value = pokemon;
            checkGuess();
            console.log("Input value:", inputValue);
            suggestionsContainer.style.display = "none";
            document.getElementById("guessInput").value = "";
        };
        
        suggestionsContainer.appendChild(suggestionItem);
    });

    suggestionsContainer.style.display = "block"; // how suggestions
}
function restartGame() {
    // Clear the table (except headers)
    let tableBody = document.getElementById("pokemonTableBody");
    tableBody.innerHTML = ""; 
    document.getElementById("guessInput").value = "";

    fetchRandomPokemon();
}


document.getElementById("restartButton").addEventListener("click", restartGame);
document.getElementById("guessInput").addEventListener("input", showSuggestions);
document.getElementById("guessInput").addEventListener("keydown", function (event){
    if (event.key === "enter"){
        checkGuess();}
});


fetchRandomPokemon();
fetchAllPokemon();