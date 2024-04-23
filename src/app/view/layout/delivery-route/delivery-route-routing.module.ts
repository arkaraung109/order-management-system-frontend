import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryRouteCreateComponent } from './delivery-route-create/delivery-route-create.component';
import { authGuard } from 'src/app/interceptor/auth.guard';
import { UserRole } from 'src/app/common/UserRole';
import { DeliveryRouteListComponent } from './delivery-route-list/delivery-route-list.component';
import { DeliveryRouteDetailsComponent } from './delivery-route-details/delivery-route-details.component';
import { DeliveryRouteUpdateComponent } from './delivery-route-update/delivery-route-update.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: DeliveryRouteCreateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'create',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
    }
  },
  {
    path: 'update',
    component: DeliveryRouteUpdateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'update',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
    }
  },
  {
    path: 'list',
    component: DeliveryRouteListComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'list',
      allowedUserRoles: [UserRole.ADMIN, UserRole.DELIVERY_MANAGER]
    }
  },
  {
    path: 'details',
    component: DeliveryRouteDetailsComponent,
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
export class DeliveryRouteRoutingModule { }
