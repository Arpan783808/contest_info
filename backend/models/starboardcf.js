import mongoose from "mongoose";
const boardSchema = new mongoose.Schema({
  username: { type: String},
  codeforces:{type:String},
  problems:{type:Number},
  avgrating:{type:Number},
  ratingchange:{type:Number},
  contest:{type:Number},
  badge:{type:String},
  score:{type:Number}
});

const Starcf = mongoose.model("Starcf", boardSchema);

export default Starcf;
