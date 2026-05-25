import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from "@angular/router";
import { ShopService } from '../../services/backend/shop/shop-service';
import { Purchase, SessionStatus } from '../../types';

@Component({
  selector: 'app-account',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
    public limit: number = 50;
    public status: SessionStatus = "complete";
    public purchases: Purchase[] = []

    constructor(private readonly shopService: ShopService) {
        setTimeout(() => {
            this.shopService
                .getPurchaseHistory()
                .then(_purchases => {
                    console.log(_purchases);
                    this.purchases = _purchases.data;
                })
        }, 1000)
    }
}
