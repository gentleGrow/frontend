export default function hasSpecialChar(nickname: string) {
  const specialCharPattern = /[!@#$%^&*(),.?":{}|<>[\]\\\/`~';+=_-]/g;
  return specialCharPattern.test(nickname);
}
