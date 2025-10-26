import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Platform, Song } from '../../types';
import { Songs } from '../../services/songs';
import { DateFormatPipe } from "../../pipes/date-format-pipe";
import { MatIcon } from "@angular/material/icon";
import { Platforms } from '../../services/platforms';
import { NgClass } from '@angular/common';
import { FullDateFormatPipe } from "../../pipes/full-date-format-pipe";
import { PopupModal } from "../../components/modals/popup-modal";

@Component({
  selector: 'app-music',
  imports: [DateFormatPipe, MatIcon, FormsModule, NgClass, FullDateFormatPipe, PopupModal],
  templateUrl: './music.html',
  styleUrl: './music.scss'
})
export class Music implements OnInit {
    platforms!: Platform[];
    songs!: Song[];
    selectedView: string = 'grid';
    expandedIndexes = new Set<number>();
    modalSong: Song | null = null;
    modalOpen: boolean = false;

    constructor(private songService: Songs, private platformService: Platforms) {
        songService.songs$.subscribe(() => {
            this.songs = songService.getAllSongs();
        });
        platformService.platforms$.subscribe(() => {
            this.platforms = platformService.getAllPlatforms();
        });
    }

    ngOnInit(): void {
        this.songService.updateSongs();
        this.platformService.updatePlatforms();
    }

    toggleExpanded(index: number) {
      if (this.expandedIndexes.has(index)) {
        this.expandedIndexes.delete(index);
      } else {
        this.expandedIndexes.add(index);
      }
    }

    isExpanded(index: number): boolean {
      return this.expandedIndexes.has(index);
    }

    openModal(song: Song) {
        this.modalSong = song;
        this.modalOpen = true;
    }
}
