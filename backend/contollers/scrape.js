import puppeteer from "puppeteer";
import dotenv from "dotenv";
import { replaceContestData, replaceContestData1 } from "./replace.js";
import Codechef from "../models/codechefcontest.js";
dotenv.config();
export async function scrapeAtcoderProfile(username) {
  const url = `https://atcoder.jp/users/${username}`;
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote,",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const userInfo = await page.evaluate(() => {
      const data = {};
      const tableRows = document.querySelectorAll(".dl-table tr");

      tableRows.forEach((row) => {
        const header = row.querySelector("th")?.innerText.trim();
        const value = row.querySelector("td")?.innerText.trim();

        switch (header) {
          case "Country/Region":
            data["CountryRegion"] = value;
            break;
          case "Rank":
            data["Rank"] = value;
            break;
          case "Rating":
            data["Rating"] = value;
            console.log(data["Rating"]);
            break;
          case "Highest Rating":
            data["HighestRating"] = value;
            break;
          case "Rated Matches":
            data["RatedMatches"] = value;
            break;
          case "Last Competed":
            data["LastCompeted"] = value;
            break;
          default:
            break;
        }
      });

      return data;
    });

    await browser.close();
    return { username, ...userInfo };
  } catch (error) {
    console.error(`Failed to retrieve profile for user: ${username}`, error);
    await browser.close();
    return null;
  }
}

export async function scrapeAtcoderContests() {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote,",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  const contests = { upcoming: [], past: [] };

  try {
    // Scrape Upcoming Contests
    await page.goto("https://atcoder.jp/contests", {
      waitUntil: "networkidle2",
    });
    contests.upcoming = await page.evaluate(() => {
      const data = [];
      const rows = document.querySelectorAll(
        "#contest-table-upcoming tbody tr"
      );
      rows.forEach((row) => {
        const columns = row.querySelectorAll("td");
        if (columns.length > 1) {
          const title = columns[1].querySelector("a")?.innerText.trim();
          const startTime = columns[0].querySelector("a")?.innerText.trim();
          const duration = columns[2].innerText.trim();
          // const url = columns[0].querySelector('a')?.href || null;
          console.log(title);
          let contestType = null;
          let contestCode = null;
          if (title) {
            const titleParts = title.split(" ");

            // Extracting the contest code which should be the last part of the title
            contestCode = titleParts.pop(); // This will be the number like "185" or "373"
            contestCode = contestCode.replace(/\)/g, "").trim();
            // Determine contest type based on the title
            if (title.includes("Beginner")) {
              contestType = "abc"; // Type for Beginner contests
            } else if (title.includes("Regular")) {
              contestType = "arc"; // Type for Regular contests
            } else if (title.includes("Heuristic")) {
              contestType = "ahc"; // Type for Heuristic contests
            }
          }
          console.log(contestType);
          console.log(contestCode);
          const contestLink = `https://atcoder.jp/contests/${contestType}${contestCode}`;

          data.push({
            name: title,
            startTime,
            duration,
            contestType,
            contestCode,
            isPast: false,
          });
        }
      });
      return data;
    });

    // Scrape Past Contests
    await page.goto("https://atcoder.jp/contests", {
      waitUntil: "networkidle2",
    });
    contests.past = await page.evaluate(() => {
      const data = [];
      const rows = document.querySelectorAll("#contest-table-recent tbody tr");
      rows.forEach((row, index) => {
        if (index > 10) return;
        const columns = row.querySelectorAll("td");
        if (columns.length > 1) {
          const title = columns[1].querySelector("a")?.innerText.trim();
          const startTime = columns[0].querySelector("a")?.innerText.trim();
          const duration = columns[2].innerText.trim();
          let contestType = "abc";
          let contestCode = null;
          if (title) {
            const titleParts = title.split(" ");

            // Extracting the contest code which should be the last part of the title
            contestCode = titleParts.pop(); // This will be the number like "185" or "373"
            contestCode = contestCode.replace(/\)/g, "").trim();
            // Determine contest type based on the title
            if (title.includes("Beginner")) {
              contestType = "abc"; // Type for Beginner contests
            } else if (title.includes("Regular")) {
              contestType = "arc"; // Type for Regular contests
            } else if (title.includes("Heuristic")) {
              contestType = "ahc"; // Type for Heuristic contests
            }
          }
          const contestLink = contestCode
            ? `https://atcoder.jp/contests/${contestType}${contestCode}`
            : null;

          data.push({
            name: title,
            startTime,
            duration,
            contestType,
            contestCode,
            isPast: true,
          });
        }
      });
      return data;
    });
    // console.log(contests);
    replaceContestData(contests);
    await browser.close();
  } catch (error) {
    console.error("Failed to retrieve contests", error);
    await browser.close();
    return { upcoming: [], past: [] };
  }
}

export async function scrapeCodechefContests() {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  const contests = { upcoming: [], past: [] };

  try {
    // Navigate to CodeChef contests page
    await page.goto("https://www.codechef.com/contests", {
      waitUntil: "networkidle2",
    });
    console.log("codecehf");
    // Scrape Upcoming Contests
    contests.upcoming = await page.evaluate(() => {
      const data = [];
      const rows = document.querySelectorAll("jss70 tbody tr");
      
      rows.forEach((row) => {
        const columns = row.querySelectorAll("td");
        if (columns.length> 1) {
          const title = columns[0].querySelector("p")?.innerText.trim();
          const startTime = columns[2].querySelector("p")?.innerText.trim();
          const duration = columns[3].querySelector("p")?.innerText.trim();
          const contestCode = title.match(/\d+/)[0];
          const contestType="START";
          data.push({
            name: title,
            startTime,
            duration,
            contestType,
            contestCode,
            isPast: false,
          });
        }
      });

      return data;
    });

    // Scrape Past Contests
    contests.past = await page.evaluate(() => {
      const data = [];
      const rows = document.querySelectorAll(".MuiTable-root tbody tr");

      rows.forEach((row) => {
        const columns = row.querySelectorAll("td");
        if (columns.length> 1) {
          const title = columns[0].querySelector("p")?.innerText.trim();
          const startTime = columns[2].querySelector("p")?.innerText.trim();
          const duration = columns[3].querySelector("p")?.innerText.trim();
          const contestCode = title.match(/\d+/)[0];
          const contestType="START";
          data.push({
            name: title,
            startTime,
            duration,
            contestType,
            contestCode,
            isPast: false,
          });
        }
      });

      return data;
    });

    replaceContestData1(contests);
    console.log("Contests scraped and saved successfully.");
  } catch (error) {
    console.error("Failed to retrieve contests", error);
  } finally {
    await browser.close();
  }
}
