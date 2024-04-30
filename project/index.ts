import express from "express";
import { Pokemon, Ability } from "./interfaces/pokemon-interfaces";

const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static("public"));

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/pokemon.json");
    const data: Pokemon[] = await response.json();
    return data;
}

app.get("/", async (req, res) => {
    let pokeData: Pokemon[] = await fetchData();
    let q: string = "";
    if (typeof req.query.q === "string") {
        q = req.query.q;
    }
    pokeData = pokeData.filter((pokemon) => {
        return pokemon.name.toLowerCase().includes(q.toLowerCase());
    })
    res.render("index", {
        pokeData: pokeData,
        q: q
    });
});

app.get("/pokemon/:pokemonname", async (req, res) => {
    const pokemonName = req.params.pokemonname;
    let pokeData: Pokemon[] = await fetchData();

    console.log(pokeData);
    pokeData = pokeData.filter((pokemon) => {
        return pokemon.name.toLowerCase().match(pokemonName.toLowerCase());
    })

    res.render("pokemon-detail", {
        pokeData: pokeData
    })
});

app.get("/abilities", async (req, res) => {
    let pokeData: Pokemon[] = await fetchData();
    let pokeAbilities: Ability[] = [];

    console.log(pokeData);

    for (let pokemon of pokeData) {
        pokeAbilities.push(pokemon.favoriteAbility);
    }

    res.json(pokeAbilities);
});

/* app.get("/sort", async (req, res) => {
    let pokeData: Pokemon[] = await fetchData();
    let q: string = "";
    let sortby: string = "";
    if (typeof req.query.q === "string") {
        q = req.query.q;
    }
    if (typeof req.query.sortby === "string") {
        sortby = req.query.sortby;
    }
    if (req.query.sortby === "id") {
        pokeData = pokeData.sort((a, b) => {
            if (a.order > b.order) { return 1; }
            else if (a.order < b.order) { return -1; }
            else { return 0; }
        });
    }
    else if (req.query.sortby === "name") {
        pokeData = pokeData.sort((a, b) => {
            if (a.name > b.name) { return 1; }
            else if (a.name < b.name) { return -1; }
            else { return 0; }
        });
    }
    else if (req.query.sortby === "type") {
        pokeData = pokeData.sort((a, b) => {
            if (a.type > b.type) { return 1; }
            else if (a.type < b.type) { return -1; }
            else { return 0; }
        });
    }
    
    res.render("index", {
        pokeData: pokeData,
        q: q
    });
}); */

app.listen(app.get("port"), ()=>console.log( "[server] http://localhost:" + app.get("port")));