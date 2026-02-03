import { Component } from '@angular/core';
import { ShopService } from '../../services/shop-service';
import { Product } from '../../types';
import { MatIcon } from "@angular/material/icon";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-cart',
  imports: [MatIcon, NgClass],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
    public cart: Product[] = [];
    public total: number = 0;
    public showPopup: boolean = false;
    public popupState: "remove" | "checkout" | "clear" | null = null;
    public removingProduct: Product | undefined;

    constructor(private shopService: ShopService) {
        this.shopService.cart$.subscribe((cart: Product[]) => {
            this.cart = cart;
            this.total = this.cart.reduce((p, c) => p + c.price, 0);
        });
    }

    public closePopup() {
        this.showPopup = false;
        setTimeout(() => {
            this.popupState = null;
            this.removingProduct = undefined;
        }, 300);
    }

    public openRemovePopup(item: Product) {
        this.showPopup = true;
        this.popupState = "remove";
        this.removingProduct = item;
    }
    public confirmRemove() {
        if (this.removingProduct) {
            this.shopService.removeFromCart(this.removingProduct);
        }
        this.showPopup = false;
    }

    public openCheckoutPopup() {
        this.showPopup = true;
        this.popupState = "checkout";
    }
    public confirmCheckout() {
        this.shopService.createCheckout();
    }


    public openClearPopup() {
        this.showPopup = true;
        this.popupState = "clear";
    }
    public confirmClear() {
        this.shopService.clearCart();
        this.showPopup = false;
    }
}
