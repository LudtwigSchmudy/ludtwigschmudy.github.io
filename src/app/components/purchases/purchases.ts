import { Component, inject } from '@angular/core';
import { ROUTER_OUTLET_DATA } from '@angular/router';
import { Purchase, PurchaseData, SessionStatus } from '../../types';

@Component({
    selector: 'app-purchases',
    imports: [],
    templateUrl: './purchases.html',
    styleUrl: './purchases.scss',
})
export class Purchases {
    private data = inject(ROUTER_OUTLET_DATA);
    public purchases: Purchase[];
    public limit: number = 50;
    public status: SessionStatus = "complete";

    constructor() {
        const { purchases, limit, status } = this.data() as {
            limit: number,
            status: SessionStatus,
            purchases: Purchase[]
        };

        this.purchases = purchases;
        console.log(purchases)
        this.limit = limit;
        this.status = status;
    }
}
