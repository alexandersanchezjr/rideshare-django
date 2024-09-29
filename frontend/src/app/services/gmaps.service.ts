import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environment';
import { Observable, map, catchError, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GmapsService {
  apiLoaded: Observable<boolean>;

  constructor(private http: HttpClient) {
    this.apiLoaded = http
      .jsonp(
        `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}`,
        'callback'
      )
      .pipe(
        map(() => true),
        catchError(() => of(false)),
        shareReplay()
      );
  }

  directions(
    origin: string,
    destination: string
  ): Observable<google.maps.DirectionsResult> {
    const request: google.maps.DirectionsRequest = {
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    const directionsService = new google.maps.DirectionsService();
    return new Observable((observer) => {
      directionsService.route(request, (result, status) => {
        if (status === 'OK' && result) {
          observer.next(result);
        } else {
          observer.error('Enter two valid addresses.');
        }
        observer.complete();
      });
    });
  }
}
