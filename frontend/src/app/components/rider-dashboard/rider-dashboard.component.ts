import { Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { TripCardComponent } from '@components/trip-card/trip-card.component';
import { Status, Trip, TripResponse } from '@models/trip';
import { TripService } from '@services/trip.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-rider-dashboard',
  standalone: true,
  imports: [TripCardComponent],
  templateUrl: './rider-dashboard.component.html',
  styles: ``,
})
export class RiderDashboardComponent {
  messages!: Subscription;
  trips!: Trip[];

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  get currentTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.driver !== null && trip.status !== Status.COMPLETED;
    });
  }

  get completedTrips(): Trip[] {
    return this.trips.filter(trip => {
      return trip.status === Status.COMPLETED;
    });
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data: Data) => {
        const trips: Trip[] = data['trips'];
        this.trips = trips
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.tripService.connect();
    this.messages = this.tripService.messages.subscribe((message: any) => {
      const tripResponse: TripResponse = message.data;
      const trip: Trip = new Trip(tripResponse);
      this.updateTrips(trip);
      this.updateToast(trip);
    });
  }

  updateTrips(trip: Trip): void {
    this.trips = this.trips.filter((thisTrip: Trip) => thisTrip.id !== trip.id);
    this.trips.push(trip);
  }

  updateToast(trip: Trip): void {
    if (trip.status === Status.STARTED) {
      this.toastr.info(`Driver ${trip.driver!.username} is coming to pick you up.`);
    } else if (trip.status === Status.IN_PROGRESS) {
      this.toastr.info(`Driver ${trip.driver!.username} is headed to your destination.`);
    } else if (trip.status === Status.COMPLETED) {
      this.toastr.info(`Driver ${trip.driver!.username} has dropped you off.`);
    }
  }

  ngOnDestroy(): void {
    this.messages.unsubscribe();
  }
}
