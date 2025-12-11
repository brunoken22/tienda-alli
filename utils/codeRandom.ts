import crypto from "crypto";

export default function generate5DigitCode() {
  return crypto.randomInt(0, 100000).toString().padStart(5, "0");
}
