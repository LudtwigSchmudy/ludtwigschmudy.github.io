import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AccountDropdown } from "./account-dropdown/account-dropdown";

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

}
