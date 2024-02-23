import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './view/layout/layout.component';
import { AuthComponent } from './view/auth/auth.component';
import { ErrorComponent } from './view/error/error.component';
import { ForgotPasswordComponent } from './view/forgot-password/forgot-password.component';
import { ActivationComponent } from './view/activation/activation.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./view/auth/auth.module').then(m => m.AuthModule)
      }
    ]
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    children: [
      {
        path: '',
        redirectTo: 'verify',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./view/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule)
      }
    ]
  },
  {
    path: 'app',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./view/layout/layout.module').then(m => m.LayoutModule),
        data: { breadcrumb: 'app' }
      }
    ]
  },
  {
    path: 'error/:errorCode',
    component: ErrorComponent
  },
  {
    path: 'activation',
    component: ActivationComponent
  },
  {
    path: '**',
    redirectTo: '/error/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
