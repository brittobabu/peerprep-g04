function matchUser(user, waitingList) {
  let index = waitingList.findIndex(
    (entry) =>
      entry.user.topic === user.topic &&
      entry.user.complexity === user.complexity &&
      entry.user.userId !== user.userId
  );

  // If no match found based on topic and complexity, match based only on topic
  if (index === -1) {
    index = waitingList.findIndex(
      (entry) =>
        entry.user.topic === user.topic &&
        entry.user.userId !== user.userId
    );
  }

  if (index !== -1) {
    const matched = waitingList.splice(index, 1)[0].user;
    return { user1: matched, user2: user };
  } else {
    waitingList.push({ user, timestamp: Date.now() });
    return null;
  }
}

module.exports = { matchUser };
