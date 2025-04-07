function matchUser(user, waitingList) {
  const existing = waitingList.find(u => u.topic === user.topic && u.complexity === user.complexity);
  if (existing) {
    waitingList.splice(waitingList.indexOf(existing), 1);
    return { user1: existing, user2: user };
  } else {
    waitingList.push(user);
    return null;
  }
}

module.exports = { matchUser };
