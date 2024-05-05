import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnfulfilledOrderListComponent } from './unfulfilled-order-list/unfulfilled-order-list.component';
import { authGuard } from 'src/app/interceptor/auth.guard';
import { UserRole } from 'src/app/common/UserRole';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'list',
    component: UnfulfilledOrderListComponent,
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
export class UnfulfilledOrderRoutingModule { }
