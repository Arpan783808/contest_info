import puppeteer from "puppeteer";
import dotenv from "dotenv";
import moment from "moment";
import axios from "axios";
import { fetchLc, fetchLcData } from "./leetcode.js";
import Week from "../models/week.js";
import {
  replaceContestData,
  replaceContestData1,
  replaceStars,
} from "./replace.js";
import Codechef from "../models/codechefcontest.js";
import { GraphQLClient, gql } from "graphql-request";

const LEETCODE_API = "https://leetcode.com/graphql";
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

    contests.upcoming = await page.evaluate(() => {
      const data = [];
      const contestDivs = document.querySelectorAll(
        "._flex__container_7s2sw_528"
      );
      console.log("rows");
      contestDivs.forEach((div) => {
        const title = div.querySelector("a")?.innerText.trim();
        const timeElements = div.querySelectorAll("p"); // Adjust the selector to match the timer div and p tags
        const hours = timeElements[0]?.innerText.trim() || "";
        const minutes = timeElements[1]?.innerText.trim() || "";
        const hasStartTime = timeElements.length > 0;
        if (!hasStartTime) return;
        const startTime = `${hours} ${minutes}`;
        const duration = "null";
        const contestType = "START";
        const contestCodeMatch = title.match(/Starters\s(\d+)/);
        const contestCode = contestCodeMatch ? contestCodeMatch[1] : null;
        if (contestCode && startTime) {
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
      const contestDivs = document.querySelectorAll(
        "._flex__container_7s2sw_528"
      );
      console.log("rows");
      contestDivs.forEach((div) => {
        const title = div.querySelector("a")?.innerText.trim();
        if (!title.includes("Starters")) return;
        const timeElements = div.querySelectorAll("p");
        const hasStartTime = timeElements.length > 0;
        const startTime = null;
        if (hasStartTime) {
          return;
        }
        const duration = "null";
        const contestType = "START";
        const contestCodeMatch = title.match(/Starters\s(\d+)/);
        const contestCode = contestCodeMatch ? contestCodeMatch[1] : null;
        data.push({
          name: title,
          startTime,
          duration,
          contestType,
          contestCode,
          isPast: true,
        });
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

async function fetchCf(username) {
  try {
    console.log("entered codeforces");
    const data = await axios.get(
      `https://codeforces.com/api/user.status?handle=${username}`
    );
    // console.log(data.data.result);
    let problems = 0;
    let totalrating = 0;
    let rated = 0;
    let ratingchange = 0;
    let num = new Set();
    let start = moment().startOf("isoWeek").unix();
    for (const submission of data.data.result) {
      const time = submission.creationTimeSeconds;
      if (time >= start) {
        if (submission.author.participantType === "CONTESTANT") {
          num.add(submission.contestId);
        }
        if (submission.verdict === "OK") {
          problems++;
          totalrating += submission.problem.rating || 0;
          if (submission.problem.rating) {
            rated++;
          }
        }
      }
    }

    const contest = num.size;
    const avgrating = Math.ceil(rated > 0 ? totalrating / rated : 0);
    const data1 = await axios.get(
      `https://codeforces.com/api/user.rating?handle=${username}`
    );
    for (const rating of data1.data.result) {
      const id = rating.contestId;
      if (num.has(id)) {
        // console.log(id);
        ratingchange += rating.newRating - rating.oldRating;
      }
    }
    const score = Math.ceil(
      problems + avgrating / 100 + ratingchange / 10 + contest * 10
    );
    console.log("leaving codeforces");
    return {
      problems,
      avgrating,
      ratingchange,
      contest,
      score,
    };
  } catch (error) {
    console.log(error.message);
  }
}

//scrape both cf and lc
export async function scrapeLeetcode() {
  try {
    const starid = [
      ["Arpan", "CodeXArpan", "_Code_Shark"],
      ["Simar", "1.6", "s1marjeet_singh"],
      ["Deepanshu", "Deepanshu_Sharma", "dsharma02102004"],
      ["Krishankant", "krishankant05", "krishankant_nsut"],
      ["Ekankaar", "ZaRobot10", "za_robot10"],
      ["Hemant", "CipherSage", "CipherSage05"],
      ["kalpit", "kalpitdon7", "kalpit04"],
      ["Ananya", "QuanCraft", "ananyak84"],
      ["Aditya", "aadichachra", "aadichachra"],
      ["Varun", "varun_cfaari", "varun9904"],
      ["Pranay", "Pranay_Contest8", "BinaryWizard_8"],
    ]; // add more users as needed
    const newstars = [];
    for (const star of starid) {
      const usernamelc = star[2];
      const usernamecf = star[1];
      let start = moment().startOf("isoWeek").unix();
      let weekData = await Week.findOne({ username:usernamelc });
      const data = await Week.findOne({ id: 1 });
      if (!data || data.week != start) {
        console.log("New week detected, updating week data...");
        await Week.deleteMany({ usernamelc });
        const prev_data = await fetchLcData(usernamelc);
        weekData = await Week.create({ username:usernamelc, week: start, prev_data });
      }
      const prev_data = weekData.prev_data;
      const userDatalc = await fetchLc(usernamelc, prev_data);
      const userDatacf = await fetchCf(usernamecf);
      if (userDatacf) {
        newstars.push({
          username: star[0],
          codeforces: userDatacf,
          leetcode: userDatalc,
          totalscore: userDatacf.score + userDatalc.score,
          badge: "Star",
        });
      }
    }
    replaceStars(newstars);
    console.log("All users' data fetched successfully:");
  } catch (error) {
    console.log(error.message);
  }
}
