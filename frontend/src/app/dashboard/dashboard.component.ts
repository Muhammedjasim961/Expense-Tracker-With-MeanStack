import { Component, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  ngOnInit(): any {
    initFlowbite();
  }
}
