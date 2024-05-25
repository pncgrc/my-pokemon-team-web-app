import { Pokemon, Ability } from "./interfaces/pokemon-interfaces";
import { MongoClient, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI || "mongodb+srv://s080037:bRW1UPhSbMMGfqF2@project-webdev.od9yc1q.mongodb.net/");

const pokemonCollection: Collection<Pokemon> = client.db("poketeam").collection<Pokemon>("pokemon");

let allPokemonData: Pokemon[] = [];

async function FillDatabase() {
    let pokemonTeam = await pokemonCollection.find({}).toArray();
    if (pokemonTeam.length === 0) {
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/pokemon.json");
        const pokeData = await response.json();
        await pokemonCollection.insertMany(pokeData);
    }
}

export async function GetPokemon() {
    return allPokemonData;
}

export async function GetPokemonByName(pokemonName: string) {
    const result = await pokemonCollection.findOne<Pokemon>({ name: pokemonName });
    console.log(result);
    return result;    
}

export async function GetAbilityByName(abilityName: string) {
    return await pokemonCollection.findOne<Pokemon>({ "favoriteAbility.name": abilityName });
}

export async function GetPokemonTeamAbilities() {
    const teamAbilities: Ability[] = [];

    for (let pokemon of allPokemonData) { teamAbilities.push(pokemon.favoriteAbility); }

    return teamAbilities;
}

async function LoadPokemon() {
    allPokemonData = await pokemonCollection.find({}).toArray();
}

async function DBExit() {
    try {
        await client.close();
        console.log("Disconnected from database");
    } catch (error) {
        console.error(error);
    }
    process.exit(0);
}

export async function DBConnect() {
    try {
        await client.connect();
        await FillDatabase();
        await LoadPokemon();
        console.log("OK WE GUCCI"); 
        process.on("SIGINT", DBExit);
    } catch (e) {
        console.error(e);
    }
}