import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-chart-dashboard',
  standalone: false,
  templateUrl: './chart-dashboard.component.html',
  styleUrls: ['./chart-dashboard.component.css'],
})
export class ChartDashboardComponent {
  // Empty chart states
}
