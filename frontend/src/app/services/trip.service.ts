import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, share } from 'rxjs';
import { WebSocketSubject, webSocket } from 'rxjs/webSocket';
import { AuthService } from './auth.service';
import { Trip, TripDataMessage, TripMessage, TripResponse } from '@models/trip';
import { environment } from 'environment';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  webSocket!: WebSocketSubject<any>;
  messages!: Observable<any>;

  private readonly hostname: string = `${environment.hostname}`;
  private readonly websocketUrl: string = `ws://${this.hostname}${environment.wsEndpoint}`;
  private readonly tripsUrl: string = `http://${this.hostname}${environment.trips}`;

  constructor(private http: HttpClient, private auth: AuthService) {}

  connect(): void {
    if (!this.webSocket || this.webSocket.closed) {
      const accessToken = this.auth.accessToken;
      this.webSocket = webSocket(
        `${this.websocketUrl}?token=${accessToken}`
      );
      this.messages = this.webSocket.pipe(share());
      this.messages.subscribe((message) => console.log(message));
    }
  }

  getTrips(): Observable<Trip[]> {
    return this.http
      .get<TripResponse[]>(this.tripsUrl)
      .pipe(
        map((tripsResponses: TripResponse[]) =>
          tripsResponses.map(
            (tripResponse: TripResponse) => new Trip(tripResponse)
          )
        )
      );
  }

  createTrip(trip: TripDataMessage): void {
    this.connect();
    const message: TripMessage = {
      type: 'create.trip',
      data: trip,
    };
    this.webSocket.next(message);
  }

  getTrip(id: string): Observable<Trip> {
    return this.http
      .get<TripResponse>(`${this.tripsUrl}/${id}`)
      .pipe(map((tripResponse: TripResponse) => new Trip(tripResponse)));
  }

  updateTrip(trip: TripDataMessage): void {
    this.connect();
    const message: TripMessage = {
      type: 'update.trip',
      data: trip,
    };
    this.webSocket.next(message);
  }
}
