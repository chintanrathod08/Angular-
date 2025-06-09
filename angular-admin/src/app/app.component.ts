import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, LayoutModule, Breakpoints } from '@angular/cdk/layout';
import { NgIf } from '@angular/common';
import { MatTreeModule } from '@angular/material/tree';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    LayoutModule,
    RouterLink,
    NgIf,
    RouterModule,
    MatTreeModule
  ]
})
export class AppComponent {
  showLayout = true;
  isSideOpen = true;
  drawerMode: 'side' | 'over' = 'side';

  breakpointObserver = inject(BreakpointObserver);

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const path = event.urlAfterRedirects;
        this.showLayout = !(path === '/login' || path === '/signup');

        if (this.drawerMode === 'over') {
          this.isSideOpen = false;
        }
      }
    });
  }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        if (result.matches) {
          this.isSideOpen = false;
          this.drawerMode = 'over';
        } else {
          this.isSideOpen = true;
          this.drawerMode = 'side';
        }
      });
  }

  //project-dropdown
  isProjectMenuOpen = false;

  toggleProjectMenu(){
    this.isProjectMenuOpen = !this.isProjectMenuOpen
  }

  //employee-dropdown
  isEmployeeMenuOpen = false;

  toggleEmployeeMenu(){
    this.isEmployeeMenuOpen = !this.isEmployeeMenuOpen
  }

}


