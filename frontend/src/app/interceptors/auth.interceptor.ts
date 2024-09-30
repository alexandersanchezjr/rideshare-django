import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: AuthService = inject(AuthService);
  const token = authService.accessToken;

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Attempt to refresh the token
        return authService.refreshToken().pipe(
          switchMap(() => {
            // After refreshing the token, retry the original request with the new token
            return next(
              req.clone({
                setHeaders: {
                  Authorization: `Bearer ${authService.accessToken}`,
                },
              })
            );
          }),
          catchError((refreshError) => {
            // Handle token refresh error (e.g., logout the user)
            authService.logout();
            return throwError(() => refreshError); // Properly propagate the error
          })
        );
      } else {
        // For other errors, just propagate the original error
        return throwError(() => error);
      }
    })
  );
};
