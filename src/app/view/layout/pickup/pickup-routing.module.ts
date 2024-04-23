import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PickupCreateComponent } from './pickup-create/pickup-create.component';
import { authGuard } from 'src/app/interceptor/auth.guard';
import { UserRole } from 'src/app/common/UserRole';
import { PickupUpdateComponent } from './pickup-update/pickup-update.component';
import { PickupListComponent } from './pickup-list/pickup-list.component';
import { PickupDetailsComponent } from './pickup-details/pickup-details.component';
import { PickupDetailsCreateComponent } from './pickup-details-create/pickup-details-create.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: PickupCreateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'create',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
    }
  },
  {
    path: 'create-details',
    component: PickupDetailsCreateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'create-details',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
    }
  },
  {
    path: 'update',
    component: PickupUpdateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'update',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
    }
  },
  {
    path: 'list',
    component: PickupListComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'list',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
    }
  },
  {
    path: 'details',
    component: PickupDetailsComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'details',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PickupRoutingModule { }
