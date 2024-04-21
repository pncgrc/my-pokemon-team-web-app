import express from "express";
import ejs from "ejs";
import { Pokemon } from "./interfaces/pokemon-interfaces";

const app = express();

app.set("view engine", "ejs");
app.set("port", 3000);
app.use(express.static("public"));

async function FetchPokemonData() {
    const response = await fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/pokemon.json");
    const pokeData: Pokemon[] = await response.json();

    app.get("/", (req, res) => {
        res.render("index", {pokeData: pokeData});    
    });
    
}

FetchPokemonData();


app.listen(app.get("port"), ()=>console.log( "[server] http://localhost:" + app.get("port")));