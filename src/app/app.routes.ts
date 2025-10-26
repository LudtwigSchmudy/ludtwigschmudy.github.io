import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Music } from './pages/music/music';
import { Shop } from './pages/shop/shop';
import { Blog } from './pages/blog/blog';
import { Contact } from './pages/contact/contact';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'music', component: Music },
    { path: 'shop', component: Shop },
    { path: 'blog', component: Blog },
    { path: 'contact', component: Contact },
];
