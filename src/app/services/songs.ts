import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Song } from '../types';

@Injectable({
    providedIn: 'root'
})
export class Songs {
    private _songSubject = new Subject<Song[]>();
    public songs$ = this._songSubject.asObservable();
    private songs: Song[] = [];

    constructor() {
        this.getSongs()
            .then(songs => songs.map(song => ({ ...song, release: new Date(song.release) })))
            .then(songs => songs.sort((a, b) => b.release.getTime() - a.release.getTime()))
            .then((songs: Song[]) => {
                this.songs = songs;
                this._songSubject.next(this.songs);
            });
    }
    
    async getSongs(): Promise<Song[]> {
        return (await fetch('/data/songs.json')).json();
    }
    getAllSongs(): Song[] {
        return this.songs;
    }
    getLatestSongs(count: number): Song[] {
        return this.songs.slice(0, count);
    }
    updateSongs(): void {
        this._songSubject.next(this.songs);
    }
}
