import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { collection, query, where, getDocs, addDoc, doc, getDoc, setDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { FirebaseApp } from '../firebase-app/firebase-app';
import { CloudCart, DownloadFiles, Product, Purchase, PurchaseData, SessionStatus } from '../../../types';
import { Router } from '@angular/router';
import { AccountService } from '../account/account';
import { ToastService } from '../../ui/toast-service';

@Injectable({
    providedIn: 'root',
})
export class ShopService {
    private db;
    private app;
    private user: any = null;
    private cartSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
    private productsLocal: { "Album": Product[], "Track": Product[] } = {
        "Album": [],
        "Track": []
    }
    private purchases: PurchaseData | null = null;

    public cart$: Observable<Product[]> = this.cartSubject.asObservable();
    
    constructor(
        private readonly appService: FirebaseApp,
        private readonly router: Router,
        private readonly accountService: AccountService,
        private readonly toastService: ToastService
    ) {
        this.app = this.appService.getInstance();
        this.db = getFirestore(this.app);

        this.accountService.user.subscribe((user) => {
            this.user = user;
            if (['/shop', '/shop/cart'].includes(this.router.url)) {
                this.getUserCart()
                    .then((cartResult: CloudCart | null) => {
                        if (cartResult === null) return;
                        this.cartSubject.next(JSON.parse(cartResult.cartData));
                    });
            }
        });
    }

    private reloadUser() {
        this.user = this.accountService.getUser()
    }

    async createCheckout() {
        this.reloadUser();
        if (!this.user) return;
        return await this.appService.createCheckoutSession({ cartData: JSON.stringify(this.cartSubject.getValue()) });
    }

    async getCheckoutStatus(sessionId: string) {
        if (!sessionId) return;
        return await this.appService.getStatus({ sessionId });
    }

    async sessionDownloads(sessionId: string): Promise<DownloadFiles[] | null> {
        if (!sessionId) return null;
        return await this.appService.getSessionDownloads({ sessionId });
    }

    async purchaseDownloads(): Promise<DownloadFiles[] | null> {
        this.reloadUser();
        if (!this.user) return null;
        return await this.appService.getPurchaseDownloads();
    }

    async savePurchases(sessionId: string) {
        this.reloadUser();
        if (!this.user) throw new Error("You must be logged in!");
        return await this.appService.savePurchases({ sessionId })
    }

    private async getUserCart(): Promise<CloudCart | null> {
        this.reloadUser();
        if (!this.user) {
            return null;
        }
        const userId = this.user.uid;

        try {
            const docRef = doc(this.db, `carts/${userId}`);
            const cartDoc = await getDoc(docRef);

            if (cartDoc.exists()) return cartDoc.data() as CloudCart;
            else return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    private async saveCart(): Promise<void> {
        this.reloadUser();
        if (!this.user) {
            // toast notification saying they need to login
            this.toastService.newToast( "error", "To use the shop, you need to login");
            this.router.navigateByUrl("/login");
            return;
        }
        const userId = this.user.uid;
        
        try {
            const cartRef = doc(this.db, `carts/${userId}`);
            const cartDoc = await getDoc(cartRef);
            if (cartDoc.exists()) {
                await setDoc(cartRef, {
                    "cartData": JSON.stringify(this.cartSubject.getValue()),
                    "updatedAt": new Date().toUTCString(),
                    "createdAt": cartDoc.data()['createdAt']
                });
            } else {
                if (this.cartSubject.getValue().length < 1) return;

                await setDoc(cartRef, {
                    "cartData": JSON.stringify(this.cartSubject.getValue()),
                    "createdAt": new Date().toUTCString()
                });
            }
        } catch (error) {
            this.toastService.newToast("error", "There was an error")
            console.error('There was an error:');
            console.error(error);
        }
    }

    /* async addAllTracks(): Promise<void> {
        const tracksFromJSon = await (await fetch('/data/items.json')).json();

        tracksFromJSon.forEach(async (track: any) => {
            // await addDoc(collection(this.db, 'products'), track)
        });
    } */

    /* Fetch all active products with their prices from Firestore */
    async getProducts(): Promise<Product[]> {
        try {
            const pQuery = query(
                collection(this.db, "products"),
                where("active", "==", true)
            );

            const qSnapshot = await getDocs(pQuery);
            const products: Product[] = [];

            for (const doc of qSnapshot.docs) {
                const productData = doc.data();

                products.push({ id: doc.id, ...productData } as Product);
            }

            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    /* Fetch all products by specified type */
    async getProductsByType(type: "Album" | "Track"): Promise<Product[]> {
        if (this.productsLocal[type].length > 0) {
            return this.productsLocal[type];
        } else {
            try {
                const pQuery = query(
                    collection(this.db, "products"),
                    where("active", "==", true),
                    where("type", "==", type),
                    orderBy(type == "Track" ? "album" : "title", "asc")
                );
    
                const qSnapshot = await getDocs(pQuery);
                const products: Product[] = qSnapshot.docs.map(doc => {
                    return { id: doc.id, ...doc.data() } as Product;
                });

                this.productsLocal[type] = products;
    
                return products;
            } catch (error) {
                console.error('Error fetching products:', error);
                return [];
            }
        }
    }

    /* Get a specific product by ID */
    async getProductById(productId: string): Promise<Product | null> {
        try {
            const docRef = doc(this.db, "products", productId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) return null;

            const productData = docSnap.data();
            // console.log(productData);

            return productData as Product;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    inCart(item: Product): boolean {
        const cart = this.cartSubject.getValue();
        const itemInCart = cart.some(itm => itm.title === item.title && itm.type === item.type);
        const albumInCart = item.type === "Track" && cart.some(itm => itm.type === "Album" && itm.title === item.album);

        return itemInCart || albumInCart;
    }

    /* Add item to cart */
    addToCart(item: Product): boolean {
        var current = this.cartSubject.getValue();
        if (current.find(itm => itm.title === item.title && itm.type === item.type)) {
            this.toastService.newToast("info", `${item.type}: ${item.title} already in cart`);
            return false;
        } else {
            if (item.type === "Album") {
                /*
                    Check if there are tracks from this album currently in the cart
                    if there is, remove the tracks, and add the album, otherwise
                    just add the album to the cart
                */
                const tracksInCart = current.find(itm => itm.type === "Track" && itm?.album === item.title);
                
                if (tracksInCart) {
                    const adjustedCart = current.filter(itm => !(itm.type === "Track" && itm?.album === item.title))
                    this.toastService.newToast("info", `${item.type}: ${item.title} added to cart, individual album tracks removed`);
                    this.cartSubject.next([...adjustedCart, item]);
                } else {
                    this.toastService.newToast("info", `${item.type}: ${item.title} added to cart`);
                    this.cartSubject.next([...current, item]);
                }
                this.saveCart();
                return true;
            } else {
                /*
                    Check if all tracks from one album is in the cart,
                    if so, remove all tracks, and add the album,
                    otherwise, keep it how it is
                */
                current = [...current, item]
                const allTracksInCart = current.filter(itm => itm.type === "Track" && itm.album === item.album)
                const album = this.productsLocal.Album.find(itm => itm.title === item.album)

                if (album && allTracksInCart.length === album.songAmount) {
                    current = current.filter(itm => !(itm.type === "Track" && itm.album === item.album));
                    this.toastService.newToast("info", `All tracks of ${item.album} in cart. Switching to album`);
                    this.cartSubject.next([...current, album])
                } else {
                    this.toastService.newToast("info", `${item.type}: ${item.title} added to cart`);
                    this.cartSubject.next(current);
                }
                this.saveCart();
                return true;
            }
        }
    }

    /* Remove item from cart */
    removeFromCart(item: Product): void {
        const current = this.cartSubject.getValue();
        if (item.type === "Track") {
            const albumInCart = current.find(itm => itm.title === item.album && itm.type === "Album");
            
            if (albumInCart) {
                this.toastService.newToast("info", "Album is in cart, you can't remove individual track")
            } else {
                const updated = current.filter(itm => !(itm.title === item.title && itm.type === item.type));
                this.cartSubject.next(updated);
                this.toastService.newToast("info", `${item.type}: ${item.title} was removed`)
                this.saveCart();
            }
        } else {
            const updated = current.filter(itm => !(itm.title === item.title && itm.type === item.type));
            this.cartSubject.next(updated);
            this.toastService.newToast("info", `${item.type}: ${item.title} was removed`)
            this.saveCart();
        }
    }

    getCartAmount(): number {
        return this.cartSubject.getValue().length;
    }

    /* Get current cart */
    getCart(): Product[] {
        return [...this.cartSubject.getValue()];
    }

    /* Clear cart */
    clearCart(): void {
        this.cartSubject.next([]);
        this.saveCart();
    }

    /* Get cart total */
    getCartTotal(): number {
        return this.cartSubject.getValue().reduce((total, item) => total + item.price, 0);
    }

    /* Get user's purchase history */
    async getPurchaseHistory(limit?: number, start?: number, status?: SessionStatus): Promise<PurchaseData> {
        this.reloadUser();
        if (!this.user) {
            console.error('User must be logged in');
            return {
                data: [],
                has_more: false
            };
        }

        if (!this.purchases) {
            return await this.appService.getPurchases({ limit: 50 })
        } else {
            return this.purchases;
        }
    }
}
