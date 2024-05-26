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
exports.homeRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
const secureMiddleware_1 = require("../secureMiddleware");
function homeRouter() {
    const router = express_1.default.Router();
    router.get("/", secureMiddleware_1.secureMiddleware, (req, res) => __awaiter(this, void 0, void 0, function* () {
        const q = typeof req.query.q === "string" ? req.query.q : "";
        const sortBy = typeof req.query.sortby === "string" ? req.query.sortby : "id";
        const sortDirection = typeof req.query.sortDirection === "string" ? req.query.sortDirection : "asc";
        const pokeData = yield (0, database_1.GetPokemon)();
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
                }
                else {
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
            sortdirection: sortDirection,
            user: req.session.user,
            message: res.locals.message
        });
    }));
    return router;
}
exports.homeRouter = homeRouter;
//# sourceMappingURL=homeRouter.js.map