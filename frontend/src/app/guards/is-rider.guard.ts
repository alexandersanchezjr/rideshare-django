import { CanActivateFn } from '@angular/router';

export const isRiderGuard: CanActivateFn = (route, state) => {
  return true;
};
