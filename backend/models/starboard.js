import mongoose from "mongoose";
const platformSchema = new mongoose.Schema({
  problems: { type: Number, default: 0 }, 
  avgrating: { type: Number, default: 0 },
  ratingchange: { type: Number, default: 0 }, 
  contest: { type: Number, default: 0 },
  score: { type: Number, default: 0 }, 
});
const boardSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  codeforces: { type: platformSchema, default: () => ({}) }, 
  leetcode: { type: platformSchema, default: () => ({}) },
  totalscore: { type: Number, default: 0 },
  badge: { type: String, default: "Star" },
});

const Star = mongoose.model("Star", boardSchema);

export default Star;
