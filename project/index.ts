import express from "express";
import { Pokemon, Ability } from "./interfaces/types";
import { DBConnect, GetAbilities, GetPokemonTeamAbilities, GetPokemonByName, GetAbilityOnPokemonByName, GetAbilityFromAbilitiesDatabaseByName, UpdatePokemon } from "./database";
import dotenv from "dotenv";
import session from "./session";
import { secureMiddleware } from "./secureMiddleware";
import { flashMiddleware } from "./flashMiddleware";
import { loginRouter } from "./routes/loginRouter";
import { homeRouter } from "./routes/homeRouter";



const app = express();
dotenv.config();

app.set("view engine", "ejs"); // View engine
app.set("port", process.env.PORT || 3000); // Port definition

app.use(express.json({ limit: "1mb" })); // Post routes
app.use(express.urlencoded({ extended:true})); // Post routes
app.use(express.static("public")); // Public folder usage
app.use(session); // session middleware
app.use(flashMiddleware);

app.use(loginRouter()); // Routes: "/login" (get & post), "/logout" (post)
app.use(homeRouter()); // Routes: "/"

app.get("/pokemon/:pokemonname", secureMiddleware, async (req, res) => {
    const pokemonName = req.params.pokemonname;

    const filteredPokeData: Pokemon | null = await GetPokemonByName(pokemonName);

    if (filteredPokeData === null) {
        res.status(404).render("404", { message: "Pokémon not found" });
    }
    else {
        res.render("pokemon-detail", {
            pokeData: filteredPokeData,
            user: req.session.user
        });
    }
});

app.get("/pokemon/:pokemonname/edit", secureMiddleware, async (req, res) => {
    const chosenPokemon = req.params.pokemonname;

    const filteredPokeData: Pokemon | null = await GetPokemonByName(chosenPokemon);
    const availableAbilities: Ability[] = await GetAbilities();

    if (req.session.user) {
        if (req.session.user.role === "ADMIN") {
            res.render("edit", {
                pokeData: filteredPokeData,
                abilityData: availableAbilities,
                error: "",
                user: req.session.user
            });
        }
        else if (req.session.user.role === "USER") {
            res.redirect("/");
        }
    
    }
    else {
        res.render("edit", {
            pokeData: filteredPokeData,
            abilityData: availableAbilities,
            error: "",
            user: req.session.user
        });
    }
    
});

app.post("/pokemon/:pokemonname/edit", async (req, res) => {
    const chosenPokemon = req.params.pokemonname;
    const filteredPokeData: Pokemon | null = await GetPokemonByName(chosenPokemon);
    const availableAbilities: Ability[] = await GetAbilities();

    let nickname: string = req.body.nickname;
    let description: string = req.body.description;
    let meta: boolean = req.body.meta === "Yes" ? true : false;
    let ability: string = req.body.ability;

    const updatedAbility: Ability | null = await GetAbilityFromAbilitiesDatabaseByName(ability);

    if (nickname === "" || description === "") {
        res.render("edit", { 
            pokeData: filteredPokeData,
            abilityData: availableAbilities,
            error: "All fields are required!",
            user: req.session.user
        });
    }
    else if (updatedAbility === null) {
        res.status(404).render("404", { message: "Something went wrong" });
    } else {
        UpdatePokemon(chosenPokemon, nickname, description, meta, updatedAbility);
        res.redirect("/pokemon/" + chosenPokemon);
    }
});

app.get("/abilities", secureMiddleware, async (req, res) => {
    const pokeAbilities: Ability[] = await GetPokemonTeamAbilities();

    res.render("pokemon-abilities", { pokeAbilities: pokeAbilities, user: req.session.user, });
});

app.get("/abilities/:abilityname", secureMiddleware, async (req, res) => {
    const abilityName = req.params.abilityname;

    const filteredPokeData: Pokemon | null = await GetAbilityOnPokemonByName(abilityName);

    if (filteredPokeData === null) {
        res.status(404).render("404", { message: "Ability not found" });
    }
    else {
        res.render("ability-detail", {
            pokeData: filteredPokeData,
            user: req.session.user
        });
    }
});

app.use((req, res, next) => {
    res.status(404).render("404", { message: "Page not found" });
});

app.listen(app.get("port"), async () => {
    try {
        await DBConnect();
        console.log( "[server] http://localhost:" + app.get("port"));
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
    
});