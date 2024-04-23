import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from 'src/app/interceptor/auth.guard';
import { UserRole } from 'src/app/common/UserRole';
import { ShippingAddressCreateComponent } from './shipping-address-create/shipping-address-create.component';
import { ShippingAddressUpdateComponent } from './shipping-address-update/shipping-address-update.component';
import { ShippingAddressListComponent } from './shipping-address-list/shipping-address-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: ShippingAddressCreateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'create',
      allowedUserRoles: [UserRole.ADMIN]
    }
  },
  {
    path: 'update',
    component: ShippingAddressUpdateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'update',
      allowedUserRoles: [UserRole.ADMIN]
    }
  },
  {
    path: 'list',
    component: ShippingAddressListComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'list',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingAddressRoutingModule { }
