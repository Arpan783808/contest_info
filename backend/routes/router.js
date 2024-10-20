
import { codeforcecontest, signup,login,leaderboard,atcoder,codechef } from "../contollers/controller.js";
import { Router } from "express";
const router=Router();
router.get("/codeforcecontest",codeforcecontest);
router.post("/login",login);
router.post("/signup",signup);
router.get('/leaderboard', leaderboard);
router.get('/atcoder',atcoder);
router.get('/codechef',codechef);
export default router;