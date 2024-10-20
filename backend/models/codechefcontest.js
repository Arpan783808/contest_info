import mongoose from "mongoose";
const contestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startTime: { type: Date, required: true },
  duration: { type: String, required: true },
  contestType: { type: String },
  contestCode: { type: String, required: true },
  isPast: { type: Boolean, default: false },
});

const Codechef = mongoose.model("Codechef", contestSchema);

export default Codechef;
