import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Menu } from 'src/app/common/Menu';
import { MenuService } from 'src/app/service/menu.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../share/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { ChangePasswordDialogComponent } from '../share/change-password-dialog/change-password-dialog.component';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthenticationService } from 'src/app/service/authentication.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  isSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Small).pipe(map(result => result.matches), shareReplay());
  isXSmall$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(map(result => result.matches), shareReplay());
  @ViewChild('drawer') drawerElement: any;
  menuList!: Menu[];
  username: string = "";
  jwtHelperService: JwtHelperService = new JwtHelperService();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private matDialog: MatDialog,
    private menuService: MenuService,
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.menuList = [...this.menuService.fetchMenuList()];
    let jwtToken = this.authService.fetchJwtToken();
    this.username = this.jwtHelperService.decodeToken(jwtToken)!.username;
  }

  changePassword(): void {
    this.matDialog.open(ChangePasswordDialogComponent, {
      width: '400px'
    });
  }

  navigateToProfile(): void {
    this.router.navigate(['/app/profile']);
  }

  toggle(): void {
    let isSmall = this.breakpointObserver.isMatched(Breakpoints.Small);
    let isXSmall = this.breakpointObserver.isMatched(Breakpoints.XSmall);
    if (isSmall || isXSmall) {
      this.drawerElement.toggle();
    }
  }

  logout() {
    const dialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: '300px', data: 'log out'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }

}
