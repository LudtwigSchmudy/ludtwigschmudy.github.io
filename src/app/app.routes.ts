import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Music } from './pages/music/music';
import { Shop } from './pages/shop/shop';
import { Account } from './pages/account/account';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { SignUp } from './pages/signup/signup';

export const routes: Routes = [
    {
      path: '',
      title: 'Lüdtwig Schmüdy - Official Website',
      component: Home
    },
    {
      path: 'music',
      title: 'Music | Lüdtwig Schmüdy',
      component: Music
    },
    {
      path: 'shop',
      title: 'Shop | Lüdtwig Schmüdy',
      component: Shop
    },
    {
      path: 'cart',
      title: 'Cart | Lüdtwig Schmüdy',
      component: Cart
    },
    {
        path: 'login',
        title: 'Login to Your Account',
        component: Login
    },
    {
        path: 'signup',
        title: 'Create Your Account',
        component: SignUp
    },
    {
      path: 'account',
      title: 'My Account',
      component: Account
    },
];
