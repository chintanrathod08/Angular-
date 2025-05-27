import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-addproject',
  imports: [MatCardModule, 
    MatIcon,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatButtonModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './addproject.component.html',
  styleUrl: './addproject.component.scss'
})
export class AddprojectComponent {
  departments = ['Web', 'Design', 'HR', 'Support'];
  priorities = ['High', 'Medium', 'Low'];
  team = ['Team A', 'Team B', 'Team C'];
  statuses = ['Active', 'Completed', 'Running', 'Pending', 'Not Started', 'Canceled'];
  status = 'Running';
}
