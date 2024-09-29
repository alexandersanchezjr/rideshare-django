import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user';

export const isRiderGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const user: User | undefined = authService.user;
  return user ? user.isRider : false;
};
