"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pokemonRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const secureMiddleware_1 = require("../secureMiddleware");
function pokemonRouter() {
    const router = express_1.default.Router();
    router.get("/pokemon/:pokemonname", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const pokemonName = req.params.pokemonname;
        const filteredPokeData = yield (0, database_1.GetPokemonByName)(pokemonName);
        if (filteredPokeData === null) {
            res.status(404).render("404", { message: "Pokémon not found" });
        }
        else {
            res.render("pokemon-detail", {
                pokeData: filteredPokeData,
                user: req.session.user
            });
        }
    }));
    router.get("/pokemon/:pokemonname/edit", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const chosenPokemon = req.params.pokemonname;
        const filteredPokeData = yield (0, database_1.GetPokemonByName)(chosenPokemon);
        const availableAbilities = yield (0, database_1.GetAbilities)();
        if (req.session.user) {
            if (req.session.user.role === "USER") {
                res.redirect("/");
            }
            else if (req.session.user.role === "ADMIN") {
                res.render("edit", {
                    pokeData: filteredPokeData,
                    abilityData: availableAbilities,
                    error: "",
                    user: req.session.user
                });
            }
        }
    }));
    router.post("/pokemon/:pokemonname/edit", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const chosenPokemon = req.params.pokemonname;
        const filteredPokeData = yield (0, database_1.GetPokemonByName)(chosenPokemon);
        const availableAbilities = yield (0, database_1.GetAbilities)();
        let nickname = req.body.nickname;
        let description = req.body.description;
        let meta = req.body.meta === "yes" ? true : false;
        let ability = req.body.ability;
        const updatedAbility = yield (0, database_1.GetAbilityFromAbilitiesDatabaseByName)(ability);
        if (nickname === "" || description === "") {
            res.render("edit", {
                pokeData: filteredPokeData,
                abilityData: availableAbilities,
                error: "Alle velden moeten ingevuld zijn!",
                user: req.session.user
            });
        }
        else if (updatedAbility === null) {
            res.status(404).render("404", { message: "Something went wrong" });
        }
        else {
            yield (0, database_1.UpdatePokemon)(chosenPokemon, nickname, description, meta, updatedAbility);
            res.redirect("/pokemon/" + chosenPokemon);
        }
    }));
    return router;
}
exports.pokemonRouter = pokemonRouter;
