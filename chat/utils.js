// utils.js
function validateMessage(obj) {
  if (!obj) return false;
  if (typeof obj.user !== "string" || obj.user.trim() === "") return false;
  if (typeof obj.message !== "string" || obj.message.trim() === "") return false;
  return true;
}
module.exports = { validateMessage };

