import { Component, effect, inject } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Purchase, PurchaseData, SessionStatus } from '../../types';
import { MatIcon } from "@angular/material/icon";
import { FullDateFormatPipe } from "../../pipes/full-date-format-pipe";

@Component({
    selector: 'app-purchases',
    imports: [MatIcon, FullDateFormatPipe],
    templateUrl: './purchases.html',
    styleUrl: './purchases.scss',
})
export class Purchases {
    private data = inject(ROUTER_OUTLET_DATA);
    public purchases: Purchase[] = [];
    public limit: number = 50;
    public status: SessionStatus = "complete";
    public loading: boolean = true;

    constructor() {
        effect(() => {
            const { purchases, limit, status, loaded } = this.data() as {
                limit: number,
                status: SessionStatus,
                purchases: Purchase[],
                loaded: boolean
            };
    
            this.purchases = purchases;
            this.limit = limit;
            this.status = status;
            if (loaded)
                this.loading = false;
        })
    }
}
