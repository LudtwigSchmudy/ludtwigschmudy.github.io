import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccountDropdown } from "./account-dropdown/account-dropdown";
import { FirebaseApp } from '../../services/backend/firebase-app/firebase-app';
import { AccountService } from '../../services/backend/account/account';

@Component({
    selector: 'app-header',
    imports: [
        RouterLink,
        RouterLinkActive,
        MatIcon,
        AccountDropdown
    ],
    templateUrl: './header.html',
    styleUrl: './header.scss'
})
export class Header {
    public isManager: boolean = false;

    constructor(
        private readonly appService: FirebaseApp,
        private readonly accountService: AccountService
    ) {
        this.accountService.user.subscribe(async () => {
            this.isManager = await this.appService.isManager();
        })
    }
}
