import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Trip } from '@models/trip';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [ NgIf, RouterModule ],
  templateUrl: './trip-card.component.html',
  styles: ``
})
export class TripCardComponent {
  @Input() title!: string;
  @Input() trips: Trip[] = [];

  constructor() {}
}
