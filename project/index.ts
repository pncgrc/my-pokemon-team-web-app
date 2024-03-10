import { Pokemon } from "./interfaces";
import pokemonData from "./pokemon.json";
import * as rls from 'readline-sync';

// Ensure data is typed as an array of Pokemon objects;

let userAnswer: number = 0;
console.log("Welcome to the Pokémon JSON data viewer!");

const DisplayData = (pokemonData: Pokemon[]) => {
    return pokemonData.map(pokemon => console.log(`- ${pokemon.name} (ID: ${pokemon.id})`));
}

while (true) {
    MenuChoice();
    if (userAnswer == 1) {
    DisplayData(pokemonData);
    } else if (userAnswer == 2) {
        // Filter functionality
    } else if (userAnswer == 3) {
        console.log("\nThank you for using the Pokémon JSON data viewer! See you next time!");
        break;
    } else {
        console.log("\nUnknown choice, please select one of the menu options:\n");
    }
}

function MenuChoice() {
    console.log("\n1. View all data");
    console.log("2. Filter by ID");
    console.log("3. Exit\n");
    userAnswer = rls.questionInt("Please enter your choice: ");
}