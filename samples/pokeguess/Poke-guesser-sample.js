
// Sample Pokémon Database
const pokemonList = {
    "pikachu": { type: "Electric", generation: 1, height: 0.4, weight: 6, color: "Yellow" },
    "charmander": { type: "Fire", generation: 1, height: 0.6, weight: 8.5, color: "Orange" },
    "bulbasaur": { type: "Grass", generation: 1, height: 0.7, weight: 6.9, color: "Green" },
    "squirtle": { type: "Water", generation: 1, height: 0.5, weight: 9, color: "Blue" }
};

// The Pokémon to guess (can be randomized)
let targetPokemon = "pikachu"; // Change this for different rounds

function checkGuess() {
    let userGuess = document.getElementById("guessInput").value.toLowerCase();
    
    if (!(userGuess in pokemonList)) {
        alert("Invalid Pokémon. Try again!");
        return;
    }

    let guessedPokemon = pokemonList[userGuess];
    let correctPokemon = pokemonList[targetPokemon];

    updateCategory("type", guessedPokemon.type, correctPokemon.type);
    updateCategory("generation", guessedPokemon.generation, correctPokemon.generation);
    updateCategory("height", guessedPokemon.height, correctPokemon.height);
    updateCategory("weight", guessedPokemon.weight, correctPokemon.weight);
    updateCategory("color", guessedPokemon.color, correctPokemon.color);
}

function updateCategory(category, guessedValue, correctValue) {
    let element = document.getElementById(category);
    element.textContent = guessedValue;
    element.className = guessedValue === correctValue ? "correct" : "wrong";
}
