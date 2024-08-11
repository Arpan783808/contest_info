import cron from "node-cron";
import Profile from "../models/profile.js";
import { scrapeAtcoderProfile } from "./scrape.js";

const usernames = [
  "CodeShark",
  "kalpitdon",
  "varun94",
  "ananyak84",
  "krishankant05",
  "Deepanshu_Sharma",
  "za_robot10",
  "AlphaSimar",
];

export const scrapeAndSave = async () => {
  const userInfo = [];

  for (const user of usernames) {
    const profile = await scrapeAtcoderProfile(user);
    if (profile) {
      userInfo.push(profile);
      await Profile.findOneAndUpdate({ username: profile.username }, profile, {
        upsert: true,
      });
    }
  }
  // console.log(userInfo);
  console.log("User data updated");
};

cron.schedule("0 0 * * *", () => {
  console.log("Running scheduled task to scrape and update user data...");
  scrapeAndSave();
});
