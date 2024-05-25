import { Pokemon, Ability } from "./interfaces/pokemon-interfaces";
import { MongoClient, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI || "mongodb+srv://s080037:bRW1UPhSbMMGfqF2@project-webdev.od9yc1q.mongodb.net/");

const pokemonCollection: Collection<Pokemon> = client.db("poketeam").collection<Pokemon>("pokemon");
const abilitiesCollection: Collection<Ability> = client.db("poketeam").collection<Ability>("abilities");

let allPokemonData: Pokemon[] = [];

let allAbilityData: Ability[] = [];

async function FillDatabase() {
    let pokemonTeam = await pokemonCollection.find({}).toArray();
    if (pokemonTeam.length === 0) {
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/pokemon.json");
        const pokeData = await response.json();
        await pokemonCollection.insertMany(pokeData);
    }

    let myAbilities = await abilitiesCollection.find({}).toArray();
    if (myAbilities.length === 0) {
        const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/abilities.json");
        const abilityData = await response.json();
        await abilitiesCollection.insertMany(abilityData);
    }
}

export async function GetPokemon() {
    return allPokemonData;
}

export async function GetAbilities() {
    return allAbilityData;
}

export async function GetPokemonByName(pokemonName: string) {
    return await pokemonCollection.findOne<Pokemon>({ name: pokemonName });  
}

export async function GetAbilityFromAbilityDBByName(abilityName: string) {
    const result = await abilitiesCollection.findOne<Ability>({name: abilityName});
    console.log(result);
    return result;
}

export async function GetAbilityOnPokemonByName(abilityName: string) {
    return await pokemonCollection.findOne<Pokemon>({ "favoriteAbility.name": abilityName });
}

export async function GetPokemonTeamAbilities() {
    const teamAbilities: Ability[] = [];

    for (let pokemon of allPokemonData) { teamAbilities.push(pokemon.favoriteAbility); }

    return teamAbilities;
}

export async function UpdatePokemon(pokemon: string, nickname: string, description: string, meta: boolean, ability: Ability) {
    pokemonCollection.updateOne({name: pokemon}, {$set: {
        nickname: nickname,
        description: description,
        active: meta,
        favoriteAbility: ability
    }});
}

async function LoadData() {
    allPokemonData = await pokemonCollection.find({}).toArray();
    allAbilityData = await abilitiesCollection.find({}).toArray();
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
        await LoadData();
        console.log("OK WE GUCCI"); 
        process.on("SIGINT", DBExit);
    } catch (e) {
        console.error(e);
    }
}