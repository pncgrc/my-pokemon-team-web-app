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
exports.loginRouter = void 0;
const express_1 = __importDefault(require("express"));
const database_1 = require("../database");
function loginRouter() {
    const router = express_1.default.Router();
    router.get("/login", (req, res) => {
        if (req.session.user) {
            res.redirect("/");
        }
        else {
            res.render("login");
        }
    });
    router.post("/login", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        try {
            let user = yield (0, database_1.Login)(username, password);
            delete user.password;
            req.session.user = user;
            req.session.message = { type: "success", message: "Login successful" };
            res.redirect("/");
        }
        catch (e) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/login");
        }
    }));
    router.post("/logout", (req, res) => __awaiter(this, void 0, void 0, function* () {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    }));
    router.get("/register", (req, res) => {
        if (req.session.user) {
            res.redirect("/");
        }
        else {
            res.render("register");
        }
    });
    router.post("/register", (req, res) => __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        try {
            yield (0, database_1.RegisterUser)(username, password);
            req.session.message = { type: "success", message: "Registration successful" };
            res.redirect("/login");
        }
        catch (e) {
            req.session.message = { type: "error", message: e.message };
            res.redirect("/register");
        }
    }));
    return router;
}
exports.loginRouter = loginRouter;
//# sourceMappingURL=loginRouter.js.map