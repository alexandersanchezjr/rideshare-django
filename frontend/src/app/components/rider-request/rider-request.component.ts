import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Trip } from '@models/trip';
import { AuthService } from '@services/auth.service';
import { TripService } from '@services/trip.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GoogleMapsModule, GoogleMap } from '@angular/google-maps';
import { GmapsService } from '@services/gmaps.service';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-rider-request',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    GoogleMapsModule,
    RouterModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './rider-request.component.html',
  styles: ``,
})
export class RiderRequestComponent {
  apiLoaded: Observable<boolean>;
  trip!: Trip;
  origin!: google.maps.LatLngLiteral;
  destination!: google.maps.LatLngLiteral;
  directions!: Observable<google.maps.DirectionsResult | undefined>;

  @ViewChild(GoogleMap)
  map!: GoogleMap;

  form: FormGroup = new FormGroup({
    pickUpAddress: new FormControl('', [Validators.required]),
    dropOffAddress: new FormControl('', [Validators.required]),
  });

  constructor(
    private googleMapsService: GmapsService,
    private router: Router,
    private toastr: ToastrService,
    private tripService: TripService,
    private auth: AuthService
  ) {
    this.apiLoaded = googleMapsService.apiLoaded;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['origin'].currentValue) {
      this.updateMap();
    }
  }

  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.origin = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.trip = new Trip({
      pickUpAddress: this.form.value.pickUpAddress,
      dropOffAddress: this.form.value.dropOffAddress,
      rider: this.auth.user!,
    })

    this.tripService.createTrip(this.trip);
    this.router.navigateByUrl('/rider');
  }

  onUpdate(): void {
    if (this.form.invalid) return;

    this.trip = new Trip({
      pickUpAddress: this.form.value.pickUpAddress,
      dropOffAddress: this.form.value.dropOffAddress,
      rider: this.auth.user!,
    })

    const { pickUpAddress, dropOffAddress } = this.trip;
    if (pickUpAddress && dropOffAddress) {
      this.toastr.info('Updating map...');
      this.directions = this.googleMapsService.directions(
        pickUpAddress,
        dropOffAddress
      );
    }
  }

  updateMap(): void {
    const bounds = new google.maps.LatLngBounds();
    if (this.origin) {
      bounds.extend(new google.maps.LatLng(this.origin.lat, this.origin.lng));
    }
    if (this.destination) {
      bounds.extend(
        new google.maps.LatLng(this.destination.lat, this.destination.lng)
      );
    }
    this.map.fitBounds(bounds);
    this.map.panToBounds(bounds);
  }
}
