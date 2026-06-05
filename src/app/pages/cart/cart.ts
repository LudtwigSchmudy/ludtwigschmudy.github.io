import { Component } from '@angular/core';
import { ShopService } from '../../services/backend/shop/shop-service';
import { Product } from '../../types';
import { MatIcon } from "@angular/material/icon";
import { NgClass } from '@angular/common';
import { DownloadZip } from '../../services/backend/download/download-zip';
import { ToastService } from '../../services/ui/toast-service';

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
    public popupState: "remove" | "checkout" | "clear" | "error" | null = null;
    public removingProduct: Product | undefined;
    public isCheckingOut: boolean = false;
    public isDownloading: boolean = false;
    public step: "" | "download" | "zip" | "done" = "";

    constructor(
        private shopService: ShopService,
        private zipService: DownloadZip,
        private toastService: ToastService
    ) {
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
    public async confirmCheckout() {
        this.isCheckingOut = true;
        const session = await this.shopService.createCheckout() as {
            status: "ok" | "error",
            url: string,
            id: string,
            message: string
        };
        
        if (!session) {
            this.toastService.newToast('error', 'Unable to create checkout session');
            this.isCheckingOut = false;
            return
        }
        else if (session.status === "error") {
            this.toastService.newToast('error', session.message);
            this.popupState = "error";
            this.isCheckingOut = false;
            return
        }
        else if (session.status === "ok") {
            const checkoutWindow = window.open(
                session.url,
                'Stripe Checkout',
                `width=500,height=700`
            );
            if (!checkoutWindow) {
                this.toastService.newToast('error', 'Popup window blocked. Check if popups are blocked');
                this.isCheckingOut = false;
                return
            }
            
            const checkInterval = setInterval(async () => {
                if (checkoutWindow.closed) {
                    clearInterval(checkInterval);
                    
                    const status = (await this.shopService.getCheckoutStatus(session.id) as any).status;

                    this.isCheckingOut = false;
                    this.showPopup = false;
                    if (status === 'paid') {
                        this.isDownloading = true;
                        // await this.shopService.savePurchases(session.id);
                        this.step = 'download';
                        const downloads = await this.shopService.sessionDownloads(session.id);

                        if (downloads) {
                            this.step = 'zip';
                            await this.zipService.downloadZip(downloads);
                            this.shopService.clearCart();
                            this.step = 'done';
                            setTimeout(() => {
                                this.isDownloading = false;
                                setTimeout(() => {
                                    this.step = "";
                                }, 300);
                            }, 1000);
                        }
                    }
                    else {
                        this.toastService.newToast('error', 'Invoice was not paid')
                        this.isCheckingOut = false;
                    }
                }
            }, 1000);
        }
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
