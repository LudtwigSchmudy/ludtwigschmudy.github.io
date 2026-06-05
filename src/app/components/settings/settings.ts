import { NgClass, NgOptimizedImage } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Component, effect, inject } from '@angular/core';
import { FullDateFormatPipe } from "../../pipes/full-date-format-pipe";
import { User } from '../../types';

@Component({
    selector: 'app-settings',
    imports: [MatIcon, NgClass, FullDateFormatPipe, NgOptimizedImage],
    templateUrl: './settings.html',
    styleUrl: './settings.scss',
})
export class Settings {
    private data = inject(ROUTER_OUTLET_DATA);
    public lightMode: boolean = false;
    public user: User | null = null;

    constructor() {
        effect(() => {
            const { userLoaded, userData } = this.data() as {
                userLoaded: boolean,
                userData: any
            };

            if (userLoaded) {
                var {
                    displayName,
                    email,
                    emailVerified,
                    metadata,
                    photoURL,
                    providerData
                } = userData ?? {};

                if (!displayName) displayName = email;
                if (!photoURL) photoURL = "/images/default-profile.png";

                this.user = {
                    displayName,
                    email,
                    emailVerified,
                    createdAt: new Date(metadata.creationTime),
                    photoURL,
                    accountType: providerData[0].providerId
                }
            }
        })
    }

    public resetImageSrc(el: HTMLImageElement) {
        el.src = "/images/default-profile.png"
    }

    public toggleMode(): void {
        this.lightMode = !this.lightMode;
    }

    public saveSettings(): void {

    }

    public manageAccount(): void {
        
    }
}
