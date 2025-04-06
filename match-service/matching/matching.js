// matcher.js

let waitingQueue = []; // Stores waiting users' requests

// Function to find and match users
function matchUser(data) {
  const matchIndex = waitingQueue.findIndex(
    (item) =>
      item.topic === data.topic &&
      item.complexity === data.complexity &&
      item.userId !== data.userId // Avoid matching the same user
  );

  if (matchIndex !== -1) {
    const matchedUser = waitingQueue.splice(matchIndex, 1)[0];
    console.log(`Match found!`);
    console.log(` Matched ${data.userId} with ${matchedUser.userId}`);
    return matchedUser;
  } else {
    console.log('No match found, adding to waiting queue');
    waitingQueue.push(data);
    return null;
  }
}

// Export the matching function
module.exports = {
  matchUser,
};
