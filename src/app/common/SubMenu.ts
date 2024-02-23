import { UserRole } from "./UserRole";

export interface SubMenu {
  url: string;
  icon: string;
  title: string;
  allowedUserRoles: UserRole[];
}
