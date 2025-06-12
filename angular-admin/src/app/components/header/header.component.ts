import { Component, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule, RouterLink],
  standalone: true
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(private auth: AuthService, private router: Router) { }

  sideBarButtonClick() {
    this.sidebarToggle.emit();
  }

  logout() {
    // ✅ Pehle confirmation lein
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout!",
      cancelButtonText: "Cancel"
    }).then((result) => {
      // ✅ Agar user confirm kare tabhi logout karein
      if (result.isConfirmed) {
        // Actual logout process
        this.auth.logout();
        
        // Success message
        Swal.fire({
          title: "Logged Out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          // Redirect to login page
          this.router.navigate(['/login']);
        });
      }
      });
  }
}