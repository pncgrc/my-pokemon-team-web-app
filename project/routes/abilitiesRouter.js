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
exports.abilitiesRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const secureMiddleware_1 = require("../secureMiddleware");
function abilitiesRouter() {
    const router = express_1.default.Router();
    router.get("/abilities", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const pokeAbilities = yield (0, database_1.GetPokemonTeamAbilities)();
        res.render("pokemon-abilities", { pokeAbilities: pokeAbilities, user: req.session.user });
    }));
    router.get("/abilities/:abilityname", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const abilityName = req.params.abilityname;
        const filteredPokeData = yield (0, database_1.GetAbilityOnPokemonByName)(abilityName);
        if (filteredPokeData === null) {
            res.status(404).render("404", { message: "Ability not found" });
        }
        else {
            res.render("ability-detail", {
                pokeData: filteredPokeData,
                user: req.session.user
            });
        }
    }));
    return router;
}
exports.abilitiesRouter = abilitiesRouter;
//# sourceMappingURL=abilitiesRouter.js.map