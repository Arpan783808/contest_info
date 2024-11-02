import { LeetCode } from "leetcode-query";
import moment from "moment";
const leetcode = new LeetCode();
export async function fetchLcData(username) {
  try {
    const data = await leetcode.user(username);
    const contestData = await leetcode.user_contest_info(username);

    var totalrating =
      data.matchedUser.submitStats.acSubmissionNum[1].count * 1000 +
      data.matchedUser.submitStats.acSubmissionNum[2].count * 1300 +
      data.matchedUser.submitStats.acSubmissionNum[3].count * 1600;
    var problems = data.matchedUser.submitStats.acSubmissionNum[0].count;

    var rating = 0;
    var contests_Attended = 0;
    if (contestData.userContestRanking) {
      rating = contestData.userContestRanking.rating;
      for (var i = 0; i < contestData.userContestRankingHistory.length; i++) {
        if (contestData.userContestRankingHistory[i].attended) {
          contests_Attended++;
        }
      }
    }

    return {
      rating: rating,
      totalrating: totalrating,
      problems: problems,
      contests_Attended: contests_Attended,
    };
  } catch (error) {
    console.log(error.message);
  }
}

export async function fetchLc(username, prev_data) {
  try {
    console.log("entered leetcode");
    const data = await fetchLcData(username);

    var ratingchange = data.rating - prev_data.rating;
    var totalrating_change = data.totalrating - prev_data.totalrating;
    var problems_change = data.problems - prev_data.problems;
    var contest = data.contests_Attended - prev_data.contests_Attended;

    var problems = problems_change;
    var avgrating = 0;
    if (problems > 0) {
      avgrating = Math.ceil(totalrating_change / problems);
    }

    var score = (score = Math.ceil(
      problems + avgrating / 100 + ratingchange / 10 + contest * 10
    ));

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
