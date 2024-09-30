import { Component } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { Trip } from '@models/trip';

@Component({
  selector: 'app-rider-detail',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './rider-detail.component.html',
  styles: ``
})
export class RiderDetailComponent {
  trip!: Trip;
  readonly photo: string = 'https://i.pinimg.com/736x/a3/5f/19/a35f196b3bff449ccd0347a0f8a58e0b.jpg';

  constructor(private route: ActivatedRoute) {}

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
}
