import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    CountryRegion: { type: String },
    Rank: { type: String },
    Rating: { type: String },
    HighestRating: { type: String },
    RatedMatches: { type: String },
    LastCompeted: { type: String },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", UserSchema);

export default Profile;
