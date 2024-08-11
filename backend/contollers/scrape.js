import puppeteer from "puppeteer";

export async function scrapeAtcoderProfile(username) {
  const url = `https://atcoder.jp/users/${username}`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
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
  const browser = await puppeteer.launch({ headless: true });
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
          const title = columns[0].querySelector("a")?.innerText.trim();
          const startTime = columns[1].querySelector("a")?.innerText.trim();
          const duration = columns[2].innerText.trim();
          // const url = columns[0].querySelector('a')?.href || null;

          let contestType = null;
          let contestCode = null;

          if (startTime) {
            const startTimeParts = startTime.split(" ");
            contestCode = startTimeParts.pop(); // Last element should be the code

            if (startTimeParts.some((part) => part.toLowerCase() === "beginner")) {
              contestType = "abc";
            } else if (
              startTimeParts.some((part) => part.toLowerCase() === "regular")
            ) {
              contestType = "arc";
            } else if (
              startTimeParts.some((part) => part.toLowerCase() === "heuristic")
            ) {
              contestType = "ahc";
            }
          }

          const contestLink = `https://atcoder.jp/contests/${contestType}${contestCode}`;

          data.push({
            title,
            startTime,
            duration,
            url: contestLink,
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
          const title = columns[0].querySelector("a")?.innerText.trim();
          const startTime = columns[1].querySelector("a")?.innerText.trim();
          const duration = columns[2].innerText.trim();
          let contestType = null;
          let contestCode = null;
          if (title) {
            const titleParts = title.split(" ");
            contestCode = titleParts.pop();

            if (titleParts.some((part) => part.toLowerCase() === "beginner")) {
              contestType = "abc";
            } else if (
              titleParts.some((part) => part.toLowerCase() === "regular")
            ) {
              contestType = "arc";
            } else if (
              titleParts.some((part) => part.toLowerCase() === "heuristic")
            ) {
              contestType = "ahc";
            }
          }

          const contestLink = contestCode
            ? `https://atcoder.jp/contests/${contestType}${contestCode}`
            : null;

          data.push({
            title,
            startTime,
            duration,
            url: contestLink,
          });
        }
      });
      return data;
    });
    // console.log(contests);
    await browser.close();
    return contests;
  } catch (error) {
    console.error("Failed to retrieve contests", error);
    await browser.close();
    return { upcoming: [], past: [] };
  }
}
