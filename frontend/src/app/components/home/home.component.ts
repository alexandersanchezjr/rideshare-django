import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '@models/user';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ NgIf, RouterModule],
  templateUrl: './home.component.html',
  styles: ``
})
export class HomeComponent {
  constructor(private auth: AuthService) { }

  get user(): User | undefined {
    return this.auth.user;
  }

  get isRider(): boolean {
    return this.user?.isRider || false;
  }

  logout(): void {
    this.auth.logout();
  }
}
