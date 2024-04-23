import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentCreateComponent } from './payment-create/payment-create.component';
import { authGuard } from 'src/app/interceptor/auth.guard';
import { UserRole } from 'src/app/common/UserRole';
import { PaymentDetailsCreateComponent } from './payment-details-create/payment-details-create.component';
import { PaymentUpdateComponent } from './payment-update/payment-update.component';
import { PaymentListComponent } from './payment-list/payment-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: PaymentCreateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'create',
      allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'create-details',
    component: PaymentDetailsCreateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'create-details',
      allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'update',
    component: PaymentUpdateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'update',
      allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
    }
  },
  {
    path: 'list',
    component: PaymentListComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'list',
      allowedUserRoles: [UserRole.ADMIN, UserRole.SALES_STAFF]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
