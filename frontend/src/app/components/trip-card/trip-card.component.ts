import { NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Trip } from '@models/trip';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [ NgIf, NgForOf, RouterModule ],
  templateUrl: './trip-card.component.html',
  styles: ``
})
export class TripCardComponent {
  @Input() title!: string;
  @Input() trips: Trip[] = [];

  private readonly driverPhotoUrl: string = 'https://i.pinimg.com/736x/a3/5f/19/a35f196b3bff449ccd0347a0f8a58e0b.jpg';
  private readonly riderPhotoUrl: string = 'https://preview.redd.it/lpdwn1nqd2x81.png?width=640&crop=smart&auto=webp&s=3f91b1b8951078c6ca1de49c4281ecbf2256f6bd';

  get photo(): string {
    return this.trips[0].rider?.isDriver ? this.driverPhotoUrl : this.riderPhotoUrl;
  }

  constructor() {}
}
