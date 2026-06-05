import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { FirebaseApp } from '../services/backend/firebase-app/firebase-app';

@Injectable({
    providedIn: 'root',
})
export class ManagerGuard implements CanActivate {
    constructor(private firebase: FirebaseApp, private router: Router) {}

    canActivate(): Promise<boolean | UrlTree> {
        return this.firebase
            .isManager()
            .then(
                (result: any) => result ? true : this.router.createUrlTree(['/login']),
                (error) => {
                    console.error('Manager check failed:', error);
                    return this.router.createUrlTree(['/login']);
                }
            );
    }
}
