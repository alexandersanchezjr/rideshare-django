import { Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { TripCardComponent } from '@components/trip-card/trip-card.component';
import { Trip, TripResponse, Status } from '@models/trip';
import { TripService } from '@services/trip.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-driver-dashboard',
  standalone: true,
  imports: [ TripCardComponent ],
  templateUrl: './driver-dashboard.component.html',
  styles: ``,
})
export class DriverDashboardComponent {
  messages!: Subscription;
  trips!: Trip[];

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  get currentTrips(): Trip[] {
    return this.trips.filter((trip: Trip) => {
      return trip.driver !== null && trip.status !== Status.COMPLETED;
    });
  }

  get requestedTrips(): Trip[] {
    return this.trips.filter((trip: Trip) => trip.status === Status.REQUESTED);
  }

  get completedTrips(): Trip[] {
    return this.trips.filter((trip: Trip) => trip.status === Status.COMPLETED);
  }

  updateTrips(newTrip: Trip): void {
    this.trips = this.trips.filter(
      (currentTrip: Trip) => currentTrip.id !== newTrip.id
    );
    this.trips.push(newTrip);
  }

  updateToast(trip: Trip): void {
    if (trip.driver === null) {
      this.toastr.info(`Rider ${trip.rider!.username} has requested a trip.`);
    }
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

  ngOnDestroy(): void {
    this.messages.unsubscribe();
  }
}
