import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive } from "@angular/router";
import { ShopService } from '../../services/backend/shop/shop-service';
import { Purchase, SessionStatus, User } from '../../types';
import { AccountService } from '../../services/backend/account/account';

@Component({
  selector: 'app-account',
  imports: [RouterOutlet, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
    public limit: number = 50;
    public status: SessionStatus = "complete";
    public purchases: Purchase[] = [];
    public loaded: boolean = false;
    public userData: User | null = null;
    public userLoaded: boolean = false;

    constructor(
        private readonly shopService: ShopService,
        private readonly accountService: AccountService
    ) {
        setTimeout(() => {
            this.userData = this.accountService.getUser();
            this.userLoaded = true;

            this.shopService
                .getPurchaseHistory()
                .then(_purchases => {
                    console.log(_purchases);
                    this.purchases = _purchases.data;
                    
                    if (this.purchases.length > 0) {
                        this.purchases = this.purchases.map(p => {
                            const { createdAt, ...rest } = p;
                            return { ...rest, createdAt: new Date(createdAt) }
                        })
                    }

                    this.loaded = true;
                })
                .catch(error => {
                    console.log(error);
                    this.purchases = [];
                    this.loaded = true;
                })
        }, 1000)
    }
}
