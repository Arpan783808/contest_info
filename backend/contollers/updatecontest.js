import { scrapeAtcoderContests, scrapeCodechefContests,scrapeLeetcode } from "./scrape.js";

export const updateContestStatus = async () => {  
  try {
    console.log("cron job called");
    scrapeAtcoderContests();
    scrapeCodechefContests();
    scrapeLeetcode();
  } catch (error) {
    console.error("Error updating contests:", error);
  }
};

setInterval(updateContestStatus,60 * 1000); // Run every minute
