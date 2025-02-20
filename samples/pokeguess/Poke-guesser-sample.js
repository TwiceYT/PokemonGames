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

