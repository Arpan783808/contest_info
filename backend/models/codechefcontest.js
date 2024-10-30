import mongoose from "mongoose";
const contestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: String, required: false },
  duration: { type: String, required: true },
  contestType: { type: String },
  contestCode: { type: String },
  isPast: { type: Boolean, default: false },
});

const Codechef = mongoose.model("Codechef", contestSchema);

export default Codechef;
