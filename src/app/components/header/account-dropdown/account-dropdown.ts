import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { AccountService } from '../../../services/account';
import { User } from '../../../types';
import { NgClass } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from "@angular/router";



@Component({
  selector: 'account-dropdown',
  imports: [MatIcon, NgClass, RouterLink, RouterLinkActive],
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
                const { displayName, email, metadata, photoURL } = user;
                this.user = { displayName, email, metadata, photoURL };
            }
        })
    }

    public openDropdown() {
        this.dropdownOpen = true;
    }
    public closeDropdown() {
        this.dropdownOpen = false;
    }

    public async logout() {
        const loggedOut = await this.authService.signOut();
        if (loggedOut) {
            this.router.navigate(['/']);
        }
        else {
            console.warn('Failed to logout');
        }
        this.dropdownOpen = false;
    }
}
