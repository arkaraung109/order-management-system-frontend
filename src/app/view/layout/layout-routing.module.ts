import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from 'src/app/interceptor/auth.guard';
import { UserRole } from 'src/app/common/UserRole';
import { ProfileComponent } from './profile/profile.component';
import { UserComponent } from './user/user.component';
import { CategoryComponent } from './category/category.component';
import { ProductComponent } from './product/product.component';
import { OrderComponent } from './order/order.component';
import { CustomerComponent } from './customer/customer.component';
import { DeliveryRouteComponent } from './delivery-route/delivery-route.component';
import { PickupComponent } from './pickup/pickup.component';
import { PaymentComponent } from './payment/payment.component';
import { UnfulfilledOrderComponent } from './unfulfilled-order/unfulfilled-order.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'dashboard',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'profile',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'category',
    component: CategoryComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./category/category.module').then(m => m.CategoryModule),
        data: { breadcrumb: 'category' }
      }
    ]
  },
  {
    path: 'product',
    component: ProductComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
        data: { breadcrumb: 'product' }
      }
    ]
  },
  {
    path: 'order',
    component: OrderComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./order/order.module').then(m => m.OrderModule),
        data: { breadcrumb: 'order' }
      }
    ]
  },
  {
    path: 'unfulfilled-order',
    component: UnfulfilledOrderComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./unfulfilled-order/unfulfilled-order.module').then(m => m.UnfulfilledOrderModule),
        data: { breadcrumb: 'unfulfilled-order' }
      }
    ]
  },
  {
    path: 'delivery-route',
    component: DeliveryRouteComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./delivery-route/delivery-route.module').then(m => m.DeliveryRouteModule),
        data: { breadcrumb: 'delivery-route' }
      }
    ]
  },
  {
    path: 'pickup',
    component: PickupComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./pickup/pickup.module').then(m => m.PickupModule),
        data: { breadcrumb: 'pickup' }
      }
    ]
  },
  {
    path: 'payment',
    component: PaymentComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
        data: { breadcrumb: 'payment' }
      }
    ]
  },
  {
    path: 'customer',
    component: CustomerComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule),
        data: { breadcrumb: 'customer' }
      }
    ]
  },
  {
    path: 'shipping-address',
    component: CustomerComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./shipping-address/shipping-address.module').then(m => m.ShippingAddressModule),
        data: { breadcrumb: 'shipping-address' }
      }
    ]
  },
  {
    path: 'user',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        data: { breadcrumb: 'user' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
