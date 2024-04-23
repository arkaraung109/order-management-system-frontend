import { Injectable } from '@angular/core';
import { Menu } from '../common/Menu';
import { UserRole } from '../common/UserRole';
import { AuthenticationService } from './authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { SubMenu } from '../common/SubMenu';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private authService: AuthenticationService
  ) { }

  fetchMenuList(): Menu[] {
    const menuList: Menu[] = [
      {
        icon: "category",
        title: "Category",
        subMenu: [
          {
            url: "/app/category/create",
            icon: "add",
            title: "Create New",
            allowedUserRoles: [UserRole.ADMIN]
          },
          {
            url: "/app/category/list",
            icon: "list",
            title: "View List",
            allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
          },
        ]
      },
      {
        icon: "shopping_bag",
        title: "Product",
        subMenu: [
          {
            url: "/app/product/create",
            icon: "add",
            title: "Create New",
            allowedUserRoles: [UserRole.ADMIN]
          },
          {
            url: "/app/product/list",
            icon: "list",
            title: "View List",
            allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
          },

        ]
      },
      {
        icon: "shopping_cart",
        title: "Order",
        subMenu: [
          {
            url: "/app/order/create",
            icon: "add",
            title: "Create New",
            allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
          },
          {
            url: "/app/order/list",
            icon: "list",
            title: "View List",
            allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
          },

        ]
      },
      {
        icon: "local_shipping",
        title: "Delivery Route",
        subMenu: [
          {
            url: "/app/delivery-route/create",
            icon: "add",
            title: "Create New",
            allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
          },
          {
            url: "/app/delivery-route/list",
            icon: "list",
            title: "View List",
            allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
          },

        ]
      },
      {
        icon: "store",
        title: "Pickup",
        subMenu: [
          {
            url: "/app/pickup/create",
            icon: "add",
            title: "Create New",
            allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
          },
          {
            url: "/app/pickup/list",
            icon: "list",
            title: "View List",
            allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
          },

        ]
      },
      {
        icon: "attach_money",
        title: "Payment",
        subMenu: [
          {
            url: "/app/payment/create",
            icon: "add",
            title: "Create New",
            allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
          },
          {
            url: "/app/payment/list",
            icon: "list",
            title: "View List",
            allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
          },

        ]
      },
      {
        icon: "people",
        title: "Customer",
        subMenu: [
          {
            url: "/app/customer/create",
            icon: "add",
            title: "Create New",
            allowedUserRoles: [UserRole.ADMIN]
          },
          {
            url: "/app/customer/list",
            icon: "list",
            title: "View List",
            allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
          },

        ]
      },
      {
        icon: "location_on",
        title: "Shipping Address",
        subMenu: [
          {
            url: "/app/shipping-address/create",
            icon: "add",
            title: "Create New",
            allowedUserRoles: [UserRole.ADMIN]
          },
          {
            url: "/app/shipping-address/list",
            icon: "list",
            title: "View List",
            allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
          },

        ]
      },
      {
        icon: "supervisor_account",
        title: "System User",
        subMenu: [
          {
            url: "/app/user/create",
            icon: "add",
            title: "Create New",
            allowedUserRoles: [UserRole.ADMIN]
          },
          {
            url: "/app/user/list",
            icon: "list",
            title: "View List",
            allowedUserRoles: [UserRole.ADMIN]
          },

        ]
      }
    ];

    let unFilteredMenuList: Menu[] = [...menuList];
    const jwtHelperService = new JwtHelperService();
    const jwtToken = this.authService.fetchJwtToken();
    const role = jwtHelperService.decodeToken(jwtToken).role;

    return unFilteredMenuList.map((menu: Menu) => {
      let filteredSubMenu = menu.subMenu.filter((subMenu: SubMenu) => {
        let filteredUserRole = subMenu.allowedUserRoles.filter((userRole: UserRole) => {
          return (userRole === role);
        });
        return filteredUserRole.length != 0;
      });
      menu.subMenu = filteredSubMenu;
      return menu;
    }).filter((menu: Menu) => {
      return menu.subMenu.length != 0;
    });
  }

}
