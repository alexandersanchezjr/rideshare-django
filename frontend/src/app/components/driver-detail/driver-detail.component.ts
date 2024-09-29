import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { Trip, TripResponse, Status } from '@models/trip';
import { AuthService } from '@services/auth.service';
import { TripService } from '@services/trip.service';

@Component({
  selector: 'app-driver-detail',
  standalone: true,
  imports: [ RouterModule, NgSwitch, NgSwitchCase, NgSwitchDefault],
  templateUrl: './driver-detail.component.html',
  styles: ``
})
export class DriverDetailComponent {
  trip!: Trip;
  status = Status;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data: Data) => {
        const tripResponse: TripResponse = data['trips'];
        this.trip = new Trip(tripResponse);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  updateTripStatus(status: string): void {
    this.trip.driver = this.auth.user!;
    this.trip.status = status as Status;
    this.tripService.updateTrip(this.trip);
  }
}
