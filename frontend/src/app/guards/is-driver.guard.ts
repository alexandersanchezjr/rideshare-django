import { CanActivateFn } from '@angular/router';

export const isDriverGuard: CanActivateFn = (route, state) => {
  return true;
};
