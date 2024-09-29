import { ResolveFn } from '@angular/router';
import { Trip } from '@models/trip';
import { TripService } from '@services/trip.service';
import { inject } from '@angular/core';

export const tripDetailResolver: ResolveFn<Trip> = (route, state) => {
  const tripService = inject(TripService);

  return tripService.getTrip(route.params['id']);
};
