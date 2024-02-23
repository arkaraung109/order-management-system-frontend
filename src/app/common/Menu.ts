import { SubMenu } from "./SubMenu";

export interface Menu {
  icon: string;
  title: string;
  subMenu: SubMenu[];
}
