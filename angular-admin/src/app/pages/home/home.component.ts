import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TableComponent } from '../../components/table/table.component';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  ScatterController,
  PointElement,
  LinearScale as LinearScaleScatter,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  ScatterController,
  PointElement,
  LinearScaleScatter
);

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [MatCardModule, MatIcon, MatProgressBarModule, TableComponent, BaseChartDirective,  ],
})
export class HomeComponent {
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'Series A',
        backgroundColor: 'rgba(54, 162, 235, 0.6)',  // Blue
        hoverBackgroundColor: 'rgba(54, 162, 235, 0.9)', // On hover
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        data: [28, 48, 40, 19, 86, 27, 90],
        label: 'Series B',
        backgroundColor: 'rgba(255, 99, 132, 0.6)',  // Red
        hoverBackgroundColor: 'rgba(255, 99, 132, 0.9)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.7)',
        titleColor: '#fff',
        bodyColor: '#fff'
      },
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: {
            size: 12
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      x: {
        ticks: {
          color: '#333'
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#333'
        }
      }
    }
  };

  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartDatasets: ChartConfiguration<'doughnut'>['data']['datasets'] = [
    {
      data: [350, 450, 100],
      label: 'Series A',
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)', // red
        'rgba(54, 162, 235, 0.7)', // blue
        'rgba(255, 206, 86, 0.7)', // yellow
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2,
    },
    {
      data: [50, 150, 120],
      label: 'Series B',
      backgroundColor: [
        'rgba(75, 192, 192, 0.7)', // teal
        'rgba(153, 102, 255, 0.7)', // purple
        'rgba(255, 159, 64, 0.7)', // orange
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2,
    },
    {
      data: [250, 130, 70],
      label: 'Series C',
      backgroundColor: [
        'rgba(255, 205, 86, 0.7)', // light yellow
        'rgba(201, 203, 207, 0.7)', // grey
        'rgba(54, 162, 235, 0.7)', // blue
      ],
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2,
    },
  ];



  public doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: false,
  };

  public scatterChartDatasets: ChartConfiguration<'scatter'>['data']['datasets'] = [
    {
      data: [
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: -2 },
        { x: 4, y: 4 },
        { x: 5, y: -3 },
      ],
      label: 'Series A',
      backgroundColor: 'rgba(255, 99, 132, 0.7)', // red dots
      pointRadius: 10,
    },
  ];

  public scatterChartOptions: ChartConfiguration<'scatter'>['options'] = {
    responsive: false,
  };
}
