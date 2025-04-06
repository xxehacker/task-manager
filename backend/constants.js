const DB_NAME = "task-manager";
const cookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 12 * 24 * 60 * 60 * 1000, // 12 days, in milliseconds
};

module.exports = {DB_NAME, cookieOptions};
