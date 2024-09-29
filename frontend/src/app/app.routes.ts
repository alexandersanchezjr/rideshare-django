import { Routes } from '@angular/router';
import { DriverDashboardComponent } from '@components/driver-dashboard/driver-dashboard.component';
import { DriverDetailComponent } from '@components/driver-detail/driver-detail.component';
import { DriverComponent } from '@components/driver/driver.component';
import { HomeComponent } from '@components/home/home.component';
import { LoginComponent } from '@components/login/login.component';
import { RiderDashboardComponent } from '@components/rider-dashboard/rider-dashboard.component';
import { RiderDetailComponent } from '@components/rider-detail/rider-detail.component';
import { RiderRequestComponent } from '@components/rider-request/rider-request.component';
import { RiderComponent } from '@components/rider/rider.component';
import { SignUpComponent } from '@components/sign-up/sign-up.component';
import { isDriverGuard } from '@guards/is-driver.guard';
import { isRiderGuard } from '@guards/is-rider.guard';
import { tripDetailResolver } from '@resolvers/trip-detail.resolver';
import { tripListResolver } from '@resolvers/trip-list.resolver';

export const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent },
  { path: 'log-in', component: LoginComponent },
  {
    path: 'rider',
    component: RiderComponent,
    canActivate: [
      isRiderGuard
    ],
    children: [
      {
        path: 'request',
        component: RiderRequestComponent
      },
      {
        path: ':id',
        component: RiderDetailComponent,
        resolve: { trip: tripDetailResolver }
      },
      {
        path: '',
        component: RiderDashboardComponent,
        resolve: { trips: tripListResolver }
      }
    ]
  },
  {
    path: 'driver',
    component: DriverComponent,
    canActivate: [
      isDriverGuard
    ],
    children: [
      {
        path: '',
        component: DriverDashboardComponent,
        resolve: { trips: tripListResolver }
      },
      {
        path: ':id',
        component: DriverDetailComponent,
        resolve: { trip: tripDetailResolver }
      }
    ]
  },
  { path: '', component: HomeComponent }
];
