import { Role } from "./Role";

export class User {
  id!: number;
  name!: string;
  email!: string;
  username!: string;
  phone!: string;
  password!: string;
  active!: boolean;
  verificationToken!: string;
  passwordResetToken!: string;
  creationTimestamp!: string;
  role: Role = new Role();
}
