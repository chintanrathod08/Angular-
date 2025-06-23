import {
  Component,
  OnInit,
  inject,
  Inject,
  PLATFORM_ID,
  ViewChild,
  AfterViewInit
} from '@angular/core';
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
import { NgIf, isPlatformBrowser } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
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
  ]
})
export class AppComponent implements OnInit, AfterViewInit {
  showLayout = true;
  isSideOpen = true;
  drawerMode: 'side' | 'over' = 'side';
  role = '';
  username = '';
  email = '';
  isProjectMenuOpen = false;
  isEmployeeMenuOpen = false;
  defaultImageUrl = 'https://via.placeholder.com/150';
  profileImageUrl: string | null = null;

  breakpointObserver = inject(BreakpointObserver);

  @ViewChild('drawer') sidenav!: MatSidenav;

  constructor(
    private router: Router,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Layout hide/show logic on route change
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const path = event.urlAfterRedirects;
        this.showLayout = !(path === '/login' || path === '/signup');
        if (this.drawerMode === 'over') this.isSideOpen = false;
      });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      if (!user) return;

      this.role = user.role || '';

      // Set username
      if ('name' in user && user.name) {
        this.username = user.name;
      } else if ('firstName' in user && 'lastName' in user) {
        this.username = `${user.firstName} ${user.lastName}`;
      } else {
        this.username = 'User';
      }

      // Profile image logic
      if ('image' in user && user.image) {
        this.profileImageUrl = user.image;

        if (isPlatformBrowser(this.platformId) && this.role === 'employee') {
          localStorage.setItem('profileImage', this.profileImageUrl);
        }
      } else if (this.role === 'admin') {
        this.profileImageUrl = 'https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-File.png';
      } else if (isPlatformBrowser(this.platformId) && this.role === 'employee') {
        const savedImage = localStorage.getItem('profileImage');
        this.profileImageUrl = savedImage ? savedImage : null;
      }
    });

    // Responsive sidenav
    this.breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        this.drawerMode = result.matches ? 'over' : 'side';
        this.isSideOpen = !result.matches;
      });
  }

  ngAfterViewInit() {
    // Add click handlers to all nav items
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.querySelectorAll('.nav-item').forEach(item => {
          item.addEventListener('click', () => this.closeSidebarOnNavigation());
        });
      });
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImageUrl = reader.result as string;
        if (isPlatformBrowser(this.platformId) && this.role === 'employee') {
          localStorage.setItem('profileImage', this.profileImageUrl);
        }
        const user = this.auth.getUser();
        if (user && 'image' in user) {
          user.image = this.profileImageUrl;
          (this.auth as any)['safeSetUser']?.(user);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  toggleProjectMenu(): void {
    this.isProjectMenuOpen = !this.isProjectMenuOpen;
  }

  toggleEmployeeMenu(): void {
    this.isEmployeeMenuOpen = !this.isEmployeeMenuOpen;
  }

  closeSidebarOnNavigation() {
    if (this.drawerMode === 'over' && this.sidenav) {
      this.sidenav.close();
    }
  }
}