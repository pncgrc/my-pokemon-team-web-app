import express from "express";
import { User } from "../interfaces/types";
import { Login } from "../database";

export function loginRouter() {
    const router = express.Router();

    router.get("/login", (req, res) => {
        if (req.session.user) {
            res.redirect("/");
        }
        else {
            res.render("login");
        }    
    });
    
    router.post("/login", async (req, res) => {
        const username: string = req.body.username;
        const password: string = req.body.password;
        try {
            let user: User = await Login(username, password);
            delete user.password; 
            req.session.user = user;
            req.session.message = {type: "success", message: "Login successful"};
            console.log(req.session.message);
            res.redirect("/");
        } catch (e : any) {
            req.session.message = {type: "error", message: e.message};
            res.redirect("/login");
        }
    });
    
    router.post("/logout", async (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
        });
    });

    return router;
}