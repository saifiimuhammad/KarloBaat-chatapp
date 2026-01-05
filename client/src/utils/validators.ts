import { isValidUsername } from "6pp";

interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const usernameValidator = (username: string): ValidationResult => {
  if (!isValidUsername(username)) {
    return { isValid: false, errorMessage: "Username is Invalid!" };
  }

  // Return valid if no errors
  return { isValid: true };
};
