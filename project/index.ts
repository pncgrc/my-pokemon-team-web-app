import express from "express";
import { Pokemon, Ability } from "./interfaces/pokemon-interfaces";
import { DBConnect, GetPokemon, GetPokemonTeamAbilities, GetPokemonByName, GetAbilityByName } from "./database";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.set("view engine", "ejs");
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
        res.status(404).render("404");
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

    const filteredPokeData: Pokemon | null = await GetAbilityByName(abilityName);

    if (filteredPokeData === null) {
        res.status(404).render("404");
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

    res.render("edit", { pokeData: filteredPokeData });

});


app.use((req, res, next) => {
    res.status(404).render("404");
});

app.listen(app.get("port"), async () => {
    /*const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/pokemon.json");
    pokeData = await response.json();*/
    await DBConnect();
    console.log( "[server] http://localhost:" + app.get("port"));
});