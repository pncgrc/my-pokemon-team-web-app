import express from "express";
import { Pokemon } from "./interfaces/pokemon-interfaces";

const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static("public"));

async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/pokemon.json");
    const pokemonData: Pokemon[] = await response.json();
    return pokemonData;
}

app.get("/", async (req, res) => {
    let pokeData: Pokemon[] = await fetchData();
    let q: string = "";
    if (typeof req.query.q === "string") {
        q = req.query.q;
    }
    pokeData = pokeData.filter((pokemon) => {
        return pokemon.name.toLowerCase().startsWith(q.toLowerCase());
    })
    res.render("index", {
        pokeData: pokeData,
        q: q
    });
});

app.listen(app.get("port"), ()=>console.log( "[server] http://localhost:" + app.get("port")));