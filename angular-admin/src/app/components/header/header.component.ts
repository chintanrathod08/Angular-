import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule, RouterLink],
  standalone: true
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();  

  constructor(private auth: AuthService, private router: Router){}

  sideBarButtonClick() {
    this.sidebarToggle.emit();
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login'])
  }

}