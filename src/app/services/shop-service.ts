import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { collection, query, where, getDocs, addDoc, doc, getDoc, setDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Functions, getFunctions, httpsCallable } from 'firebase/functions';
import { FirebaseApp } from './firebase-app';
import { CloudCart, Price, Product, StripeItem } from '../types';
import { Router } from '@angular/router';



@Injectable({
    providedIn: 'root',
})
export class ShopService {
    private db;
    private auth;
    private app;
    private functions: Functions;
    private cartSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([
        {
            "album":"He's Coming Back",
            "active":true,
            "type":"Track",
            "imageURL":"/images/songs/hes-coming-back.jpg",
            "title":"Kingdom First",
            "price":1
        },
        {
            "type":"Track",
            "active":true,
            "title":"King of Grace",
            "imageURL":"/images/songs/hes-coming-back.jpg",
            "album":"He's Coming Back",
            "price":1
        },
        {
            "type":"Track",
            "title":"Metamorphosis",
            "active":true,
            "imageURL":"/images/songs/hes-coming-back.jpg",
            "price":1,
            "album":"He's Coming Back"
        },
        {
            "active":true,
            "imageURL":"/images/songs/the-spirit-hits-different.jpg",
            "title":"The Spirit Hits Different",
            "price":13,
            "songAmount":16,
            "type":"Album"
        },
        {
            "active":true,
            "title":"King Forever",
            "imageURL":"/images/songs/king-forever.jpg",
            "type":"Album",
            "price":10,
            "songAmount":12
        },
        {
            "active":true,
            "imageURL":"/images/songs/hes-coming-back.jpg",
            "songAmount":17,
            "price":14,
            "type":"Album",
            "title":"He's Coming Back"
        }
    ]);

    public cart$: Observable<Product[]> = this.cartSubject.asObservable();
    
    constructor(
        private readonly appService: FirebaseApp,
        private readonly router: Router
    ) {
        this.app = this.appService.getInstance();
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.functions = getFunctions(this.app);
        this.getUserCart()
            .then((result: CloudCart | null) => {
                if (result === null) return;

                this.cartSubject.next(JSON.parse(result.cartData));
            })
    }

    createCheckout() {
        const callable = httpsCallable(this.functions, 'createCheckoutSession');
        callable({ cart: this.cartSubject.getValue() }).then(async (res: any) => {
            window.location.href = res.url;
        });
    }

    private async getUserCart(): Promise<CloudCart | null> {
        if (!this.auth.currentUser) {
            // toast notification
            return null;
        }
        const userId = this.auth.currentUser.uid;

        try {
            const docRef = doc(this.db, `carts/${userId}`);
            const cartDoc = await getDoc(docRef);

            console.log();
            console.log('Cart received from the cloud');
            console.log(cartDoc.data());
            console.log();

            if (cartDoc.exists()) {
                return cartDoc.data() as CloudCart;
            }
            else {
                return null;
            }
        } catch (error) {
            console.error('There was an error:');
            console.error(error);
            return null;
        }
    }

    private async saveCart(): Promise<void> {
        if (!this.auth.currentUser) {
            // toast notification saying they need to login
            this.router.navigateByUrl("/login");
            return;
        }
        const userId = this.auth.currentUser.uid;
        console.log(`\nCurrent userId: ${userId}\n `);
        
        console.log(JSON.stringify(this.cartSubject.getValue()));
        
        /* try {
            const cartRef = doc(this.db, `carts/${userId}`);
            const cartDoc = await getDoc(cartRef);
            if (cartDoc.exists()) {
                await setDoc(cartRef, {
                    "cartData": JSON.stringify(this.cart),
                    "updatedAt": new Date().toUTCString(),
                    "createdAt": cartDoc.data()['createdAt']
                });
            } else {
                if (this.cart.length < 1) return;

                await setDoc(cartRef, {
                    "cartData": JSON.stringify(this.cart),
                    "createdAt": new Date().toUTCString()
                });
            }
        } catch (error) {
            console.error('There was an error:');
            console.error(error);
        } */
    }

    /* Convert Cart from products to Stripe Products */
    private convertCart(): StripeItem[] {


        return [];
    }

    async addAllTracks(): Promise<void> {
        const tracksFromJSon = await (await fetch('/data/items.json')).json();

        tracksFromJSon.forEach(async (track: any) => {
            // await addDoc(collection(this.db, 'products'), track)
        });
    }

    async getPrices(): Promise<Price[]> {
        try {
            const pQuery = query(collection(this.db, "prices"));

            const qSnapshot = await getDocs(pQuery);
            const products: Price[] = qSnapshot.docs.map((doc) => {
                return doc.data() as Price;
            });

            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

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

                products.push(productData as Product);
            }

            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    /* Fetch all products by specified type */
    async getProductsByType(type: string): Promise<Product[]> {
        try {
            const pQuery = query(
                collection(this.db, "products"),
                where("active", "==", true),
                where("type", "==", type),
                orderBy(type == "Track" ? "album" : "title", "asc")
            );

            const qSnapshot = await getDocs(pQuery);
            const products: Product[] = [];

            for (const doc of qSnapshot.docs) {
                const productData = doc.data();

                products.push(productData as Product);
            }

            return products;
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    /* Get a specific product by ID */
    async getProductById(productId: string): Promise<Product | null> {
        try {
            const docRef = doc(this.db, "products", productId);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) return null;

            const productData = docSnap.data();
            console.log(productData);

            return productData as Product;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    inCart(item: Product): boolean {
        return this.cartSubject.getValue().some(itm => itm.title === item.title && itm.type === item.type);
    }

    /* Add item to cart */
    addToCart(item: Product): boolean {
        const current = this.cartSubject.getValue();
        if (current.find(itm => itm.title === item.title && itm.type === item.type)) {
            return false;
        } else {
            this.cartSubject.next([...current, item]);
            this.saveCart();
            return true;
        }
    }

    /* Remove item from cart */
    removeFromCart(item: Product): void {
        const updated = this.cartSubject.getValue().filter(itm => !(itm.title === item.title && itm.type === item.type));
        this.cartSubject.next(updated);
        this.saveCart();
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
    async getPurchaseHistory(): Promise<any[]> {
        const user = this.auth.currentUser;
        
        if (!user) {
            console.error('User must be logged in');
            return [];
        }

        try {
            const ordersRef = collection(this.db, "users", user.uid, "orders");
            const snapshot = await getDocs(ordersRef);
            const orders: any[] = [];

            snapshot.forEach((doc) => {
                orders.push({
                    id: doc.id,
                    ...doc.data()
                });
            });

            return orders;
        } catch (error) {
            console.error('Error fetching purchase history:', error);
            return [];
        }
    }
}
