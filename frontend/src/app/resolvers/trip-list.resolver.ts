import { ResolveFn } from '@angular/router';

export const tripListResolver: ResolveFn<boolean> = (route, state) => {
  return true;
};
