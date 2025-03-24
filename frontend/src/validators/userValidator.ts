export interface NewUser {
    username: string;
    firstname: string;
    lastname: string;
    gender: string;
    password: string;
    score?: number;
    role?: string;    
  }
  
export const validateUserInput = (user: NewUser): string | null => {
  const allowedGenders = ["male", "female", "other"];
  const { username, firstname, lastname, gender, password } = user;

  if (!username) return "Username is required.";
  if (username.trim().length < 3 || username.length > 80) return "Username must be 3–80 characters.";

  if (!firstname) return "First name is required.";
  if (firstname.length > 80) return "First name must be ≤ 80 characters.";

  if (!lastname) return "Last name is required.";
  if (lastname.length > 80) return "Last name must be ≤ 80 characters.";

  if (!gender) return "Gender is required.";
  if (!allowedGenders.includes(gender.toLowerCase())) return "Gender must be male, female, or other.";

  if (!password) return "Password is required.";
  if (password.length < 5) return "Password must be at least 5 characters.";

  return null;
};
