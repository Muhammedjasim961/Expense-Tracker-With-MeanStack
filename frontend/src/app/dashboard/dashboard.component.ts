import { Component, OnInit, ViewChild } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  ngOnInit(): any {
    initFlowbite();
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.username = user.username;
        this.email = user.email;
      }
    });
  }
  username: any = '';
  email: any = '';
  loading = false;
  constructor(private userService: UserService) {
    const storedUser: any = localStorage.getItem('user');

    const toStringUser = JSON.parse(storedUser); // convert to object
    this.username = toStringUser.username;
  }
}
