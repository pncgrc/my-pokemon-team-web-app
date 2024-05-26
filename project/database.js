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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConnect = exports.UpdatePokemon = exports.GetPokemonTeamAbilities = exports.GetAbilityOnPokemonByName = exports.GetAbilityFromAbilitiesDatabaseByName = exports.GetPokemonByName = exports.GetAbilities = exports.GetPokemon = exports.RegisterUser = exports.Login = exports.MONGODB_URI = void 0;
const mongodb_1 = require("mongodb");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
exports.MONGODB_URI = (_a = process.env.MONGO_URI) !== null && _a !== void 0 ? _a : "mongodb+srv://s080037:bRW1UPhSbMMGfqF2@project-webdev.od9yc1q.mongodb.net/";
const client = new mongodb_1.MongoClient(exports.MONGODB_URI);
/*** COLLECTION USERS ***/
const userCollection = client.db("login-express").collection("users");
const saltRounds = 10;
function CreateInitialUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        if ((yield userCollection.countDocuments()) > 0) {
            return;
        }
        let adminUsername = process.env.ADMIN_USERNAME;
        let adminPassword = process.env.ADMIN_PASSWORD;
        let userUsername = process.env.USER_USERNAME;
        let userPassword = process.env.USER_PASSWORD;
        if (adminUsername === undefined || adminPassword === undefined || userUsername === undefined || userPassword === undefined) {
            throw new Error("ADMIN_USERNAME, ADMIN_PASSWORD, USER_USERNAME & USER_PASSWORD must be set in environment");
        }
        yield userCollection.insertMany([
            { username: adminUsername, password: yield bcrypt_1.default.hash(adminPassword, saltRounds), role: "ADMIN" },
            { username: userUsername, password: yield bcrypt_1.default.hash(userPassword, saltRounds), role: "USER" }
        ]);
    });
}
function Login(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (username === "" || password === "") {
            throw new Error("Username and password required");
        }
        let user = yield userCollection.findOne({ username: username });
        if (user) {
            if (yield bcrypt_1.default.compare(password, user.password)) {
                return user;
            }
            else {
                throw new Error("Password incorrect");
            }
        }
        else {
            throw new Error("User not found");
        }
    });
}
exports.Login = Login;
function RegisterUser(username, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (username === "" || password === "") {
            throw new Error("Username and password required");
        }
        let user = yield userCollection.findOne({ username: username });
        if (user) {
            throw new Error("User already exists");
        }
        else {
            yield userCollection.insertOne({ username: username, password: yield bcrypt_1.default.hash(password, saltRounds), role: "USER" });
        }
    });
}
exports.RegisterUser = RegisterUser;
/*** COLLECTIONS POKEMON & ABILITY ***/
const pokemonCollection = client.db("poketeam").collection("pokemon");
const abilitiesCollection = client.db("poketeam").collection("abilities");
function FillDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        let pokemonTeam = yield pokemonCollection.find({}).toArray();
        if (pokemonTeam.length === 0) {
            const response = yield fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/pokemon.json");
            const pokeData = yield response.json();
            yield pokemonCollection.insertMany(pokeData);
        }
        let myAbilities = yield abilitiesCollection.find({}).toArray();
        if (myAbilities.length === 0) {
            const response = yield fetch("https://raw.githubusercontent.com/AP-G-1PRO-Webontwikkeling/project-webontwikkeling-pncgrc/main/project/abilities.json");
            const abilityData = yield response.json();
            yield abilitiesCollection.insertMany(abilityData);
        }
    });
}
function GetPokemon() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pokemonCollection.find({}).toArray();
    });
}
exports.GetPokemon = GetPokemon;
function GetAbilities() {
    return __awaiter(this, void 0, void 0, function* () {
        return yield abilitiesCollection.find({}).toArray();
    });
}
exports.GetAbilities = GetAbilities;
function GetPokemonByName(pokemonName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pokemonCollection.findOne({ name: pokemonName });
    });
}
exports.GetPokemonByName = GetPokemonByName;
function GetAbilityFromAbilitiesDatabaseByName(abilityName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield abilitiesCollection.findOne({ name: abilityName });
    });
}
exports.GetAbilityFromAbilitiesDatabaseByName = GetAbilityFromAbilitiesDatabaseByName;
function GetAbilityOnPokemonByName(abilityName) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield pokemonCollection.findOne({ "favoriteAbility.name": abilityName });
    });
}
exports.GetAbilityOnPokemonByName = GetAbilityOnPokemonByName;
function GetPokemonTeamAbilities() {
    return __awaiter(this, void 0, void 0, function* () {
        const pokemonData = yield pokemonCollection.find({}).toArray();
        let teamAbilities = [];
        for (let pokemon of pokemonData) {
            teamAbilities.push(pokemon.favoriteAbility);
        }
        return teamAbilities;
    });
}
exports.GetPokemonTeamAbilities = GetPokemonTeamAbilities;
function UpdatePokemon(pokemon, nickname, description, meta, ability) {
    return __awaiter(this, void 0, void 0, function* () {
        pokemonCollection.updateOne({ name: pokemon }, { $set: {
                nickname: nickname,
                description: description,
                active: meta,
                favoriteAbility: ability
            } });
    });
}
exports.UpdatePokemon = UpdatePokemon;
function DBExit() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.close();
            console.log("Disconnected from database");
        }
        catch (error) {
            console.error(error);
        }
        process.exit(0);
    });
}
function DBConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield FillDatabase();
            yield CreateInitialUsers();
            console.log("OK WE GUCCI");
            process.on("SIGINT", DBExit);
        }
        catch (e) {
            console.error(e);
        }
    });
}
exports.DBConnect = DBConnect;
