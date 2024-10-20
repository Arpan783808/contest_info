import Contest from './models/Contest'; 
export const saveContest = async (contestData) => {
  try {
    const contest = new Contest({
      name: contestData.name,
      startTime: contestData.startTime,
      duration: contestData.duration,
      isPast: false, 
    });

    await contest.save();
    console.log('Contest saved successfully!');
  } catch (error) {
    console.error('Error saving contest:', error);
  }
};