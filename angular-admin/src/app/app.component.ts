import { Component, OnInit, inject } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterOutlet,
  RouterModule,
  RouterLink
} from '@angular/router';
import {
  BreakpointObserver,
  Breakpoints,
  LayoutModule
} from '@angular/cdk/layout';
import { NgIf } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    RouterOutlet,
    RouterModule,
    RouterLink,
    NgIf,
    LayoutModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    HeaderComponent
  ],
})
export class AppComponent implements OnInit {
  showLayout = true;
  isSideOpen: boolean = true;
  drawerMode: 'side' | 'over' = 'side';
  role: string = '';
  username: string = '';
  isProjectMenuOpen = false;
  isEmployeeMenuOpen = false;

  breakpointObserver = inject(BreakpointObserver);

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const path = event.urlAfterRedirects;
        this.showLayout = !(path === '/login' || path === '/signup');

        // Auto-close sidenav on small screens
        if (this.drawerMode === 'over') this.isSideOpen = false;
      });
  }

  ngOnInit(): void {
    // Subscribe to current user data
    this.auth.user$.subscribe(user => {
      if (!user) return;

      this.role = user.role || '';

      if ('name' in user && user.name) {
        this.username = user.name;
      } else if ('firstName' in user && 'lastName' in user) {
        this.username = `${user.firstName} ${user.lastName}`;
      } else {
        this.username = 'User';
      }
    });

    // Adjust sidebar layout based on screen size
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.drawerMode = result.matches ? 'over' : 'side';
        this.isSideOpen = !result.matches;
      });
  }

  toggleProjectMenu(): void {
    this.isProjectMenuOpen = !this.isProjectMenuOpen;
  }

  toggleEmployeeMenu(): void {
    this.isEmployeeMenuOpen = !this.isEmployeeMenuOpen;
  }
}
