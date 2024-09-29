import { Component } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { Trip, TripResponse } from '@models/trip';

@Component({
  selector: 'app-rider-detail',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './rider-detail.component.html',
  styles: ``
})
export class RiderDetailComponent {
  trip!: Trip;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data: Data) => {
        const tripResponse: TripResponse = data['trip'];
        this.trip = new Trip(tripResponse);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
}
