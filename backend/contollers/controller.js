import axios from "axios";
import User from "../models/users.js";
import Profile from "../models/profile.js";
import createsecrettoken from "../token.js";
import bcrypt from "bcryptjs";
import { scrapeAndSave } from "./scrapeandsave.js";
import { scrapeAtcoderContests } from "./scrape.js";
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ success: true, message: "data required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: true, message: "user does not exist" });
    }
    const auth = await bcrypt.compare(password, user.password);
    if (!auth) {
      return res.json({ message: "incorrect password or email" });
    }
    const token = createsecrettoken(user._id);
    res.status(201).json({
      token: token,
      message: "user logged in successfully",
      success: true,
      userid: user._id,
    });
    next();
  } catch (error) {
    console.error(error);
    res.json({ success: true, message: error.message });
  }
};
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !password || !email) {
      return res.json({ success: false, message: "user data required" });
    }
    const ispresent = await User.findOne({ email });
    if (ispresent) {
      return res.json({ success: false, message: "user already exist" });
    }
    const user = await User.create({ username, email, password });
    user.password = await bcrypt.hash(password, 12);
    await user.save();
    const token = createsecrettoken(user._id);
    res.status(201).json({
      token: token,
      message: "User signed up successfully",
      success: true,
      user,
    });
    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
};
export const codeforcecontest = async (req, res) => {
  try {
    const response = await axios.get("https://codeforces.com/api/contest.list");
    const contests = response.data.result.slice(1, 20).map((contest) => ({
      id: contest.id,
      name: contest.name,
      start_time: contest.startTimeSeconds * 1000,
      duration: contest.durationSeconds,
      status: contest.phase.toLowerCase(),
      relativeTime: contest.relativeTimeSeconds,
    }));
    res.json({ success: true, contests });
  } catch (error) {
    res.json({ success: false });
    console.log(error.message);
  }
};
export const leaderboard = async (req, res) => {
  try {
    console.log("entered");
    scrapeAndSave();
    const users = await Profile.find().sort({ Rank: 1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const atcoder = async (req, res) => {
  try {
    const contests = await scrapeAtcoderContests();
    // console.log(contests.upcoming[0].contestLink);
    console.log(contests);
    res.json(contests);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to retrieve contests", error: error.message });
  }
};
