import { isValidUsername, isValidEmail } from "6pp";

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

export const emailValidator = (email: string): ValidationResult => {
  if (!isValidEmail(email)) {
    return { isValid: false, errorMessage: "Email is Invalid!" };
  }
  // Return valid if no errors
  return { isValid: true };
};
