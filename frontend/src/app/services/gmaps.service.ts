import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Observable, map, catchError, of, shareReplay, combineLatest, switchMap } from 'rxjs';
import { Loader } from '@googlemaps/js-api-loader';
import { MapDirectionsService, MapGeocoder, MapGeocoderResponse } from '@angular/google-maps';

@Injectable({
  providedIn: 'root',
})
export class GmapsService {

  constructor(
    private mapGeocoder: MapGeocoder,
    private mapDirectionsService: MapDirectionsService
  ) {
    const additionalOptions = {};
    // [START maps_programmatic_load_promise]
    const loader = new Loader({
      apiKey: environment.googleMapsApiKey,
      version: 'weekly',
      ...additionalOptions,
    });

    loader.importLibrary('maps')
  }

  directions(
    originAddress: string,
    destinationAddress: string
  ): Observable<google.maps.DirectionsResult | undefined> {
    // Use combineLatest to wait for both observables to emit lat/lng results
    return combineLatest([
      this.getLatLng(originAddress),      // Fetch origin lat/lng
      this.getLatLng(destinationAddress)  // Fetch destination lat/lng
    ]).pipe(
      switchMap(([origin, destination]) => {
        // Once both lat/lngs are available, call the directions service
        const request: google.maps.DirectionsRequest = {
          origin,                         // Use lat/lng literal for origin
          destination,                    // Use lat/lng literal for destination
          travelMode: google.maps.TravelMode.DRIVING,
        };
        return this.mapDirectionsService.route(request).pipe(
          map((response) => response.result),
          catchError((error) => {
            console.error('Error fetching directions:', error);
            return of(undefined);  // Handle errors gracefully
          })
        );
      })
    );
  }

  getLatLng(address: string): Observable<google.maps.LatLngLiteral> {
    return this.mapGeocoder.geocode({
      address: address
    }).pipe(
      map((response: MapGeocoderResponse) => {
        if (response['results'].length === 0) {
          throw new Error('No results found');
        }
        return response['results'][0].geometry.location.toJSON();
      }),
      catchError((error) => {
        console.error('Error getting address:', error);
        return of({ lat: 0, lng: 0 });
      }),
      shareReplay(1)
    );
  }
}
