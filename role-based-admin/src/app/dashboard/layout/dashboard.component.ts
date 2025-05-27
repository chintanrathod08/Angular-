import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
 templateUrl: './layout.component.html'

})
export class LayoutComponent implements OnInit {
  role: string = '';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.role = this.auth.getRole();
  }

  logout() {
    this.auth.logout();
  }
}
