import { Component } from '@angular/core';
import { ShopService } from '../../services/shop-service';
import { CartItem, Price, Product } from '../../types';
import { MatIcon } from "@angular/material/icon";
import { NgClass } from '@angular/common';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-shop',
  imports: [MatIcon, NgClass, RouterLink],
  templateUrl: './shop.html',
  styleUrl: './shop.scss'
})
export class Shop {
    public albums: Product[] = [];
    public tracks: Product[] = [];
    public isLoading: boolean = false;
    public showCartDot: boolean = false;
    constructor(private shopService: ShopService) {
        this.updateShop();
    }

    public async updateShop() {
        this.isLoading = true;
        const albums = await this.shopService.getProductsByType("Album");
        const tracks = await this.shopService.getProductsByType("Track");
        
        this.albums = albums;
        this.tracks = tracks;
        this.isLoading = false;
    }

    public get cartNum(): string {
        const num = this.shopService.getCartAmount();
        if (num > 0) this.showCartDot = true;
        else this.showCartDot = false;
        return num >= 10 ? '9+' : num.toString();
    }

    public inCart(item: Product): boolean {
        return this.shopService.inCart(item);
    }

    public handleCart(item: Product): void {
        if (this.inCart(item)) this.shopService.removeFromCart(item);
        else this.shopService.addToCart(item);
    }





        /* let newItem: CartItem;
        const productId = this.prices.find((price: Price) => {
            if (item.type !== price.type) return false;
            if (item.type === "Album") {
                return item.title === price.albumTitle;
            }
            if (item.type === "Track") {
                return true;
            }
            return false;
        })

        if (!productId) return;

        const success = this.shopService.addToCart({
            productId: productId.productId,
            name: item.title,
            price: item.price,
            quantity: 1
        });

        if (!success) {
            // show error
        } */


}
