export default function (identity) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;

  let identityKey = "";
  if (emailRegex.test(identity)) {
    identityKey = "email";
  }
  if (usernameRegex.test(identity)) {
    identityKey = "username";
  }
  return identityKey;
}
