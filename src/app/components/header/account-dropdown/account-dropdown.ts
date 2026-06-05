import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { AccountService } from '../../../services/backend/account/account';
import { User } from '../../../types';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";



@Component({
    selector: 'account-dropdown',
    imports: [
        MatIcon,
        NgClass,
        RouterLink,
        RouterLinkActive,
        NgOptimizedImage
    ],
    templateUrl: './account-dropdown.html',
    styleUrl: './account-dropdown.scss',
})
export class AccountDropdown {
    user: User | null;
    dropdownOpen = false;
    router = inject(Router);

    constructor(private authService: AccountService) {
        this.user = this.authService.getUser();
        this.authService.user.subscribe((user: any) => {
            if (user === null) this.user = null;
            else {
                var { displayName, email, metadata, photoURL } = user;

                if (!displayName) displayName = email;
                if (!photoURL) photoURL = "/images/default-profile.png";

                this.user = { displayName, email, metadata, photoURL };
            }
        })
    }

    public resetImageSrc(el: HTMLImageElement) {
        el.src = "/images/default-profile.png"
    }

    public openDropdown(keyPressed?: string) {
        if (keyPressed) {
            if (keyPressed === 'Enter') {
                this.dropdownOpen = !this.dropdownOpen;
            }
        } else {
            this.dropdownOpen = true;
        }
    }
    public closeDropdown() {
        this.dropdownOpen = false;
    }

    public async logout() {
        const loggedOut = await this.authService.signOut();
        if (loggedOut) {
            await this.router.navigate(['/']);
        }
        else {
            console.warn('Failed to logout');
        }
        this.dropdownOpen = false;
    }
}
