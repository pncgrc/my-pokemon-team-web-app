import { Pokemon } from "./interfaces";
import * as rls from "readline-sync";

let userAnswer: number = 0;
let userAnswerID: number = 0;
console.log("Welcome to the Pokémon JSON data viewer!");

async function FetchAndDisplayPokemonData() {
    const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/pokemon.json");
    const pokeData: Pokemon[] = await response.json();

    const DisplayData = (pokemonData: Pokemon[]) => {
        return pokemonData.map(pokemon => console.log(`- ${pokemon.name} (ID: ${pokemon.id})`));
    }

    const FilterData = (pokemonData: Pokemon[], pokemonID: number) => {
        return pokemonData.filter(pokemon => pokemon.id == pokemonID);
    }

    const IsIDValid = (pokemonData: Pokemon[], id: number): boolean => {
        return pokemonData.some(pokemon => pokemon.id == id);
    }
    
    while (true) {
        console.log("\n1. View all data");
        console.log("2. Filter by ID");
        console.log("3. Exit\n");
        userAnswer = rls.questionInt("Please enter your choice: ");
        if (userAnswer == 1) {
            console.log();
            DisplayData(pokeData);
        } else if (userAnswer == 2) {
            let userAnswerID = rls.questionInt("Please enter the ID you want to filter by: ");
            if(IsIDValid(pokeData, userAnswerID)) {
                let FilteredPokemon = FilterData(pokeData, userAnswerID);
                console.log(`\n- Name: ${FilteredPokemon[0].name} (${FilteredPokemon[0].id})`);
                console.log(`  - Type: ${FilteredPokemon[0].type}`);
                console.log(`  - Description: ${FilteredPokemon[0].description}`);
                console.log(`  - Order #: ${FilteredPokemon[0].order}`);
                console.log(`  - Active: ${FilteredPokemon[0].active}`);
                console.log(`  - Birthdate: ${FilteredPokemon[0].birthdate}`);
                console.log(`  - Image: ${FilteredPokemon[0].imageUrl}`);
                console.log(`  - Description: ${FilteredPokemon[0].description}`);
                console.log(`  - Hobbies: ${FilteredPokemon[0].hobbies.join(", ")}`);
                console.log(`  - Favorite move: ${FilteredPokemon[0].favoriteMove.name}`);
                console.log(`    - Type: ${FilteredPokemon[0].favoriteMove.type}`);
                console.log(`    - Description: ${FilteredPokemon[0].favoriteMove.description}`);
                console.log(`    - ID: ${FilteredPokemon[0].favoriteMove.id}`);
                console.log(`    - Power: ${FilteredPokemon[0].favoriteMove.power}`);
                console.log(`    - Accuracy: ${FilteredPokemon[0].favoriteMove.accuracy}`);
            }
            else {
                console.log(`\nID ${userAnswerID} doesn't exist in our JSON data. Please try again.`)
            }
            
        } else if (userAnswer == 3) {
            console.log("\nThank you for using the Pokémon JSON data viewer! See you next time!");
            break;
        } else {
            console.log("\nUnknown choice, please select one of the menu options:\n");
        }
    }
}

FetchAndDisplayPokemonData();