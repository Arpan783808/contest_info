
import Contest from '../models/contest.js';  // Import the contest model
import Codechef from '../models/codechefcontest.js';
import Star from '../models/starboard.js';
import Starcf from "../models/starboardcf.js";
export const replaceContestData = async (contests) => {
  try {
    // Step 1: Clear existing contests from MongoDB
    await Contest.deleteMany({});
    console.log('Old contest data cleared.');

    // Step 2: Insert upcoming contests
    const upcomingContests = contests.upcoming.map(contest => ({
      name: contest.name,
      startTime: contest.startTime,
      duration: contest.duration,
      contestType:contest.contestType,
      contestCode:contest.contestCode,
      isPast: false, // Upcoming contests
    }));

    // Step 3: Insert past contests
    const pastContests = contests.past.map(contest => ({
      name: contest.name,
      startTime: contest.startTime,
      duration: contest.duration,
      contestType:contest.contestType,
      contestCode:contest.contestCode,
      isPast: true,  // Past contests
    }));

    // Step 4: Insert all new contest data into MongoDB
    await Contest.insertMany([...upcomingContests, ...pastContests]);
    console.log('New contest data inserted successfully!');
    
  } catch (error) {
    console.error('Error replacing contest data:', error);
  }
};


export const replaceContestData1 = async (contests) => {
  try {
    // Step 1: Clear existing contests from MongoDB
    await Codechef.deleteMany({});
    console.log('Old contest data cleared.');

    // Step 2: Insert upcoming contests
    const upcomingContests = contests.upcoming.map(contest => ({
      name: contest.name,
      startTime: contest.startTime,
      duration: contest.duration,
      contestType:contest.contestType,
      contestCode:contest.contestCode,
      isPast: false, // Upcoming contests
    }));

    // Step 3: Insert past contests
    const pastContests = contests.past.map(contest => ({
      name: contest.name,
      startTime: contest.startTime,
      duration: contest.duration,
      contestType:contest.contestType,
      contestCode:contest.contestCode,
      isPast: true,  // Past contests
    }));

    // Step 4: Insert all new contest data into MongoDB
    await Codechef.insertMany([...upcomingContests, ...pastContests]);
    console.log('New contest data inserted successfully!');
    
  } catch (error) {
    console.error('Error replacing contest data:', error);
  }
};
export const replaceStars= async (stars) => {
  try {
    // Step 1: Clear existing contests from MongoDB
    await Star.deleteMany({});
    console.log('Old stars cleared.');
    await Star.insertMany(stars);
    console.log('New stars added ');    
  } catch (error) {
    console.error('Error replacing contest data:', error);
  }
};