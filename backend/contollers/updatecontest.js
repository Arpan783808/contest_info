import { scrapeAtcoderContests, scrapeCodechefContests } from "./scrape.js";

export const updateContestStatus = async () => {  
  try {
    console.log("atcoderscrapercalled");
    scrapeAtcoderContests();
    scrapeCodechefContests();
  } catch (error) {
    console.error("Error updating contests:", error);
  }
};

setInterval(updateContestStatus, 12 * 60 * 60 * 1000); // Run every minute
