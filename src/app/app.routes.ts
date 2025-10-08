import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { guestOnlyGuard } from './guards/guest-only';

export const routes: Routes = [
  { path: 'login', component: Login, canActivate: [guestOnlyGuard] },
  { path: 'signup', component: SignUp, canActivate: [guestOnlyGuard] },
];
