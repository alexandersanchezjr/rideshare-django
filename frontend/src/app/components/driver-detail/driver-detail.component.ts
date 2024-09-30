import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { Trip, Status } from '@models/trip';
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
  readonly photo: string = 'https://preview.redd.it/lpdwn1nqd2x81.png?width=640&crop=smart&auto=webp&s=3f91b1b8951078c6ca1de49c4281ecbf2256f6bd';

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data: Data) => {
        const trip: Trip = data['trip'];
        this.trip = trip;
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
