import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Item, Post, Song } from '../../types';
import { Songs } from '../../services/songs';
import { ShopItem } from '../../services/shop-item';
import { DateFormatPipe } from "../../pipes/date-format-pipe";
import { BlogPost } from '../../services/blog';
import { FullDateFormatPipe } from "../../pipes/full-date-format-pipe";
import { MatIcon } from "@angular/material/icon";
import { PopupModal } from "../../components/modals/popup-modal";



@Component({
    selector: 'app-home',
    imports: [
        RouterLink,
        DateFormatPipe,
        FullDateFormatPipe,
        MatIcon, PopupModal
    ],
    templateUrl: './home.html',
    styleUrl: './home.scss'
})
export class Home implements OnInit {
    songs!: Song[];
    items!: Item[];
    posts!: Post[];
    modalSong: Song | null = null;
    modalOpen: boolean = false;

    constructor(private songService: Songs,
                private shopItemService: ShopItem,
                private blogService: BlogPost) {
        songService.songs$.subscribe(() => {
            this.songs = songService.getLatestSongs(4);
        });
        shopItemService.items$.subscribe(() => {
            this.items = shopItemService.getSomeItems(4);
        });
        blogService.blogPosts$.subscribe(() => {
            this.posts = blogService.getLatestPosts(2);
        });
    }
    ngOnInit(): void {
        this.songService.updateSongs();
        this.shopItemService.updateItems();
        this.blogService.updatePosts();
    }

    openModal(song: Song) {
        this.modalSong = song;
        this.modalOpen = true;
    }
}
