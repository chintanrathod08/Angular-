import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-mytask',
  imports: [
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './mytask.component.html',
  styleUrl: './mytask.component.scss'
})
export class MytaskComponent {

}
