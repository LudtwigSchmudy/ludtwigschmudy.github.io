import { Component, Input } from '@angular/core';

@Component({
    selector: 'Toast',
    templateUrl: './toast.html',
    styleUrl: './toast.scss',
})
export class Toast {
    @Input() type!: 'error' | 'success' | 'info';
    @Input() state!: 'open' | 'closing' | 'closed';
    @Input() message!: string;
}
