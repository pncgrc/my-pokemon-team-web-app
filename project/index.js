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
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const dotenv_1 = __importDefault(require("dotenv"));
const session_1 = __importDefault(require("./session"));
const secureMiddleware_1 = require("./secureMiddleware");
const flashMiddleware_1 = require("./flashMiddleware");
const loginRouter_1 = require("./routes/loginRouter");
const homeRouter_1 = require("./routes/homeRouter");
const pokemonRouter_1 = require("./routes/pokemonRouter");
const abilitiesRouter_1 = require("./routes/abilitiesRouter");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.set("view engine", "ejs"); // View engine
app.set("port", process.env.PORT || 3000); // Port definition
app.use(express_1.default.json({ limit: "1mb" })); // Post routes
app.use(express_1.default.urlencoded({ extended: true })); // Post routes
app.use(express_1.default.static("public")); // Public folder usage
app.use(session_1.default); // session middleware
app.use(flashMiddleware_1.flashMiddleware); //flash message middleware
// Routers
app.use((0, loginRouter_1.loginRouter)()); // Routes: "/login" (get & post), "/logout" (post)
app.use((0, homeRouter_1.homeRouter)()); // Routes: "/" (get)
app.use((0, pokemonRouter_1.pokemonRouter)()); // Routes: "/pokemon/:pokemonname" (get), "/pokemon/:pokemonname/edit" (get & post)
app.use((0, abilitiesRouter_1.abilitiesRouter)()); // Routes: "/abilities" (get), "/abilities/:abilityname" (get)
app.use(secureMiddleware_1.secureMiddleware, (req, res, next) => {
    res.status(404).render("404", { message: "Page not found" });
});
app.listen(app.get("port"), () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, database_1.DBConnect)();
        console.log("[server] http://localhost:" + app.get("port"));
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
}));
//# sourceMappingURL=index.js.map