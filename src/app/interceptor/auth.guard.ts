import { HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { JwtHelperService } from '@auth0/angular-jwt';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthenticationService);
  const router = inject(Router);
  const jwtHelperService = new JwtHelperService();
  const jwtToken: string = authService.fetchJwtToken();

  if (jwtToken) {
    if (jwtHelperService.isTokenExpired(jwtToken)) {
      localStorage.removeItem('access_token');
      router.navigate(['/error', HttpStatusCode.Unauthorized]);
      return false;
    }

    const allowedUserRoles = route.data['allowedUserRoles'];
    const loginUser = jwtHelperService.decodeToken(jwtToken);

    if (!allowedUserRoles.includes(loginUser.role)) {
      router.navigate(['/error', HttpStatusCode.Forbidden]);
      return false;
    }

    return true;
  } else {
    router.navigate(['/auth']);
    return false;
  }

};
