import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Item } from '../types';

@Injectable({
    providedIn: 'root'
})
export class ShopItem {
    private items: Item[] = [];
    private _itemSubject = new Subject<Item[]>();
    public items$ = this._itemSubject.asObservable();

    constructor() {
        this.getItems()
            .then((items: Item[]) => {
                this.items = items;
                this._itemSubject.next(this.items);
            });
    }
    
    private async getItems(): Promise<Item[]> {
        return (await fetch('/data/items.json')).json();
    }
    public getAllItems(): Item[] {
        return this.items;
    }
    public getSomeItems(count: number): Item[] {
        return this.items.slice(0, count);
    }
    public updateItems(): void {
        this._itemSubject.next(this.items);
    }
}
