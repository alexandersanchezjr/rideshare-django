import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TripDataMessage } from '@models/trip';
import { AuthService } from '@services/auth.service';
import { TripService } from '@services/trip.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { GoogleMap, MapDirectionsRenderer } from '@angular/google-maps';
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
    GoogleMap,
    MapDirectionsRenderer,
    RouterModule,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './rider-request.component.html',
  styles: ``,
})
export class RiderRequestComponent {
  trip!: TripDataMessage;
  origin!: google.maps.LatLngLiteral;
  destination!: google.maps.LatLngLiteral;
  directions!: Observable<google.maps.DirectionsResult | undefined>;
  zoom: number = 4;

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
    private auth: AuthService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['origin'].currentValue) {
      this.updateMap();
    }
    if (changes['destination'].currentValue) {
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

  moveMap(event: google.maps.MapMouseEvent) {
    this.origin = event.latLng!.toJSON();
  }

  move(event: google.maps.MapMouseEvent) {
    this.destination = event.latLng!.toJSON();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.trip = {
      pick_up_address: this.form.value.pickUpAddress,
      drop_off_address: this.form.value.dropOffAddress,
      rider: this.auth.user!.id!,
    };

    this.tripService.createTrip(this.trip);
    this.router.navigateByUrl('/rider');
  }

  onUpdate(): void {
    if (this.form.invalid) return;

    this.trip = {
      pick_up_address: this.form.value.pickUpAddress,
      drop_off_address: this.form.value.dropOffAddress,
      rider: this.auth.user!.id!,
    };
    const { pick_up_address, drop_off_address } = this.trip;
    if (pick_up_address && drop_off_address) {
      this.toastr.info('Updating map...');
      this.directions = this.googleMapsService.directions(
        pick_up_address,
        drop_off_address
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
    // this.map.fitBounds(bounds);
    // this.map.panToBounds(bounds);
  }
}
