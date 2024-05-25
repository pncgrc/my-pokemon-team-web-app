import express from "express";
import { Pokemon, Ability } from "./interfaces/pokemon-interfaces";
import { DBConnect, GetPokemon, GetAbilities, GetPokemonTeamAbilities, GetPokemonByName, GetAbilityOnPokemonByName, GetAbilityFromAbilityDBByName, UpdatePokemon } from "./database";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.set("view engine", "ejs");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended:true}));
app.set("port", process.env.PORT || 3000);
app.use(express.static("public"));

let pokeData: Pokemon[] = [];

app.get("/", async (req, res) => {
    pokeData = await GetPokemon();

    const q: string = typeof req.query.q === "string" ? req.query.q : "";
    const sortBy: string = typeof req.query.sortby === "string" ? req.query.sortby : "id";
    const sortDirection: string = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";

    let filteredPokeData = pokeData;

    filteredPokeData = filteredPokeData.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(q.toLowerCase());
    });

    filteredPokeData = filteredPokeData.sort((a, b) => {
        if (sortBy === "id") {
            return sortDirection === "asc" ? a.order - b.order : b.order - a.order;
        }
        else if (sortBy === "name") {
            return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        else if (sortBy === "type") {
            return sortDirection === "asc" ? a.type.localeCompare(b.type) : b.type.localeCompare(a.type);
        }
        else if (sortBy === "meta") {
            if (sortDirection === "asc") {
                return a.active === b.active ? 0 : a.active ? -1 : 1;
            } else {
                return a.active === b.active ? 0 : a.active ? 1 : -1;
            }
        }
        else {
            return 0;
        }
    });

    res.render("index", {
        pokeData: filteredPokeData,
        q: q,
        sortby: sortBy,
        sortdirection: sortDirection
    });
});

app.get("/pokemon/:pokemonname", async (req, res) => {
    const pokemonName = req.params.pokemonname;

    const filteredPokeData: Pokemon | null = await GetPokemonByName(pokemonName);

    if (filteredPokeData === null) {
        res.status(404).render("404", { message: "Pokémon not found" });
    }
    else {
        res.render("pokemon-detail", {
            pokeData: filteredPokeData
        });
    }
});

app.get("/abilities", async (req, res) => {
    const pokeAbilities: Ability[] = await GetPokemonTeamAbilities();

    res.render("pokemon-abilities", { pokeAbilities });
});

app.get("/abilities/:abilityname", async (req, res) => {
    const abilityName = req.params.abilityname;

    const filteredPokeData: Pokemon | null = await GetAbilityOnPokemonByName(abilityName);

    if (filteredPokeData === null) {
        res.status(404).render("404", { message: "Ability not found" });
    }
    else {
        res.render("ability-detail", {
            pokeData: filteredPokeData
        });
    }
});

app.get("/edit/:pokemonname", async (req, res) => {
    const chosenPokemon = req.params.pokemonname;

    const filteredPokeData: Pokemon | null = await GetPokemonByName(chosenPokemon);
    const availableAbilities: Ability[] = await GetAbilities();

    res.render("edit", {
        pokeData: filteredPokeData,
        abilityData: availableAbilities,
        error: ""
    });
});

app.post("/edit/:pokemonname", async (req, res) => {
    const chosenPokemon = req.params.pokemonname;
    const filteredPokeData: Pokemon | null = await GetPokemonByName(chosenPokemon);
    const availableAbilities: Ability[] = await GetAbilities();

    let nickname: string = req.body.nickname;
    let description: string = req.body.description;
    let meta: boolean = req.body.meta === "Yes" ? true : false;
    let ability: string = req.body.ability;

    const updatedAbility: Ability | null = await GetAbilityFromAbilityDBByName(ability);

    if (nickname === "" || description === "") {
        res.render("edit", { 
            pokeData: filteredPokeData,
            abilityData: availableAbilities,
            error: "All fields are required!"} );
    }
    else if (updatedAbility === null) {
        res.status(404).render("404", { message: "Something went wrong" });
    } else {
        UpdatePokemon(chosenPokemon, nickname, description, meta, updatedAbility);
        res.redirect("/pokemon/" + chosenPokemon);
    }
});


app.use((req, res, next) => {
    res.status(404).render("404", { message: "Page not found" });
});

app.listen(app.get("port"), async () => {
    await DBConnect();
    console.log( "[server] http://localhost:" + app.get("port"));
});