import { Pokemon } from "./interfaces";
import * as pokemonData from "./pokemon.json";
//import * as pokemonMoveData from "./pokemon-moves.json";
import * as rls from 'readline-sync';

const allPokemondata: Pokemon[] = [

]

let userAnswer: number = 0;
console.log("Welcome to the Pokémon JSON data viewer!");

while (true) {
    MenuChoice();
    if (userAnswer == 1) {
        pokemonData.map(pokemon => {
            console.log(`- ${pokemon.name} (${pokemon.id})`);
        });
    }
    else if (userAnswer == 2) {

    }
    else if (userAnswer == 3) {
        console.log("\nThank you for using the Pokémon JSON data viewer! See you next time!")
        break;
    }
    else {
        console.log("\nUnknown choice, please select one of the menu options:\n")
    }
}

function MenuChoice() {
    console.log("\n1. View all data");
    console.log("2. Filter by ID");
    console.log("3. Exit\n");    
    userAnswer = rls.questionInt("Please enter your choice: ")
}
















/*const testPokemonMoves: PokemonMoves = {
    id: pokemonMoveData[0].id,
    name: pokemonMoveData[0].name,
    type: pokemonMoveData[0].type,
    power: pokemonMoveData[0].power,
    accuracy: pokemonMoveData[0].accuracy,
    description: pokemonMoveData[0].description
}

const testPokemon: Pokemon = {
    id: pokemonData[0].id,
    name: pokemonData[0].name,
    description: pokemonData[0].description,
    order: pokemonData[0].order,
    isActive: pokemonData[0].active,
    birthdate: pokemonData[0].birthdate,
    imageUrl: pokemonData[0].imageUrl,
    type: pokemonData[0].type,
    hobbies: pokemonData[0].hobbies,
    favoriteMove: testPokemonMoves
}


console.log(testPokemon);*/