import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { authGuard } from 'src/app/interceptor/auth.guard';
import { UserRole } from 'src/app/common/UserRole';
import { CustomerUpdateComponent } from './customer-update/customer-update.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: CustomerCreateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'create',
      allowedUserRoles: [UserRole.ADMIN]
    }
  },
  {
    path: 'update',
    component: CustomerUpdateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'update',
      allowedUserRoles: [UserRole.ADMIN]
    }
  },
  {
    path: 'list',
    component: CustomerListComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'list',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER, UserRole.SALES_STAFF]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
