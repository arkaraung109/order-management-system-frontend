import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductCreateComponent } from './product-create/product-create.component';
import { ProductUpdateComponent } from './product-update/product-update.component';
import { authGuard } from 'src/app/interceptor/auth.guard';
import { UserRole } from 'src/app/common/UserRole';
import { ProductListComponent } from './product-list/product-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: ProductCreateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'create',
      allowedUserRoles: [UserRole.ADMIN]
    }
  },
  {
    path: 'update',
    component: ProductUpdateComponent,
    canActivate: [authGuard],
    data: {
      breadcrumb: 'update',
      allowedUserRoles: [UserRole.ADMIN]
    }
  },
  {
    path: 'list',
    component: ProductListComponent,
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
export class ProductRoutingModule { }
