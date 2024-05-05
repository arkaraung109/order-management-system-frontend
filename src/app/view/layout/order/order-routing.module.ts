import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderCreateComponent } from './order-create/order-create.component';
import { authGuard } from 'src/app/interceptor/auth.guard';
import { UserRole } from 'src/app/common/UserRole';
import { OrderUpdateComponent } from './order-update/order-update.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderDetailsFulfilmentHistoryComponent } from './order-details-fulfilment-history/order-details-fulfilment-history.component';
import { OrderPaymentHistoryComponent } from './order-payment-history/order-payment-history.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: OrderCreateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'create',
      allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'update',
    component: OrderUpdateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'update',
      allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'list',
    component: OrderListComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'list',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'details',
    component: OrderDetailsComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'details',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'payment-history',
    component: OrderPaymentHistoryComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'details',
      allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'order-details-fulfilment-history',
    component: OrderDetailsFulfilmentHistoryComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'order-details-fulfilment-history',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
