import {CanActivateFn, Router} from '@angular/router';
import {Inject, inject} from "@angular/core";
import {HostService} from "../service/host.service";


export const authGuard: CanActivateFn = (
  route, state
  ) =>
{
  const hostService = inject(HostService);
  const router = inject(Router);

   return (hostService.isAuthenticated()) ? true : router.navigate(['/auth']);
};
