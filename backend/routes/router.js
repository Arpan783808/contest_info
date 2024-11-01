
import { codeforcecontest, signup,login,leaderboard,atcoder,codechef,starboard } from "../contollers/controller.js";
import { Router } from "express";
const router=Router();
router.get("/codeforcecontest",codeforcecontest);
router.post("/login",login);
router.post("/signup",signup);
router.get('/leaderboard', leaderboard);
router.get('/atcoder',atcoder);
router.get('/codechef',codechef);
router.get('/starboard',starboard);
export default router;