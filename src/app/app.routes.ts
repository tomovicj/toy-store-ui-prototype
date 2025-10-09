import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { SignUp } from './pages/sign-up/sign-up';
import { guestOnlyGuard } from './guards/guest-only';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login, canActivate: [guestOnlyGuard] },
  { path: 'signup', component: SignUp, canActivate: [guestOnlyGuard] },
];
