import mongoose from "mongoose";
const platformSchema = new mongoose.Schema({
  problems: { type: Number, default: 0 },
  totalrating: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  contests_Attended: { type: Number, default: 0 }
});
const weekschema = new mongoose.Schema({
  username:{type:String},
  week: { type: Number, default: -1 },
  prev_data:{type:platformSchema,default:() => ({}) }
});

const Week = mongoose.model("Week", weekschema);

export default Week;
