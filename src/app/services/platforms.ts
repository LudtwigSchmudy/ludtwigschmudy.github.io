import { Injectable } from '@angular/core';
import { Platform } from "../types";
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Platforms {
    private _platformSubject = new Subject<Platform[]>();
    public platforms$ = this._platformSubject.asObservable();
    private platforms: Platform[] = [];

    constructor() {
        this.getPlatforms()
            .then(platforms => platforms.map(platform => ({ ...platform })))
            .then((platforms: Platform[]) => {
                this.platforms = platforms;
                this._platformSubject.next(this.platforms);
            });
    }
    
    async getPlatforms(): Promise<Platform[]> {
        return (await fetch('/data/platform.json')).json();
    }
    getAllPlatforms(): Platform[] {
        return this.platforms;
    }
    updatePlatforms(): void {
        this._platformSubject.next(this.platforms);
    }
}
