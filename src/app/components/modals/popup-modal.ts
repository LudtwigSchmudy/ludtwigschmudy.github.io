import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Song } from '../../types';

@Component({
    selector: 'app-popup-modal',
    imports: [],
    templateUrl: './popup-modal.html',
    styleUrl: './popup-modal.scss'
})
export class PopupModal implements OnDestroy {
    @Input() song: Song | null = null;
    @Input() modalOpen: boolean = false;
    @Output() modalOpenChange = new EventEmitter<boolean>();

    openModal(song: Song) {
        this.song = song;
        this.modalOpen = true;
    }
    closeModal(e: Event) {
        if ((e.target as HTMLElement).id !== 'listen-modal' && (e.target as HTMLElement).id !== 'closeBtn') return;
        this.modalOpen = false;
        this.modalOpenChange.emit(this.modalOpen);
    }

    ngOnDestroy(): void {
        this.song = null;
    }
}
