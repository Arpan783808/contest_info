
import { codeforcecontest, signup,login,leaderboard,atcoder } from "../contollers/controller.js";
import { Router } from "express";
const router=Router();
router.get("/codeforcecontest",codeforcecontest);
router.post("/login",login);
router.post("/signup",signup);
router.get('/leaderboard', leaderboard);
router.get('/atcoder',atcoder);
export default router;