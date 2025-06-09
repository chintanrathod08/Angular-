import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone : true,
  selector: 'app-estimates',
  imports: [TableComponent,MatIconModule],
  templateUrl: './estimates.component.html',
  styleUrl: './estimates.component.scss'
})
export class EstimatesComponent {}
