import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@interceptors/auth.interceptor';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      ToastrModule.forRoot(),
    ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
