import { Injectable } from '@angular/core';
import { Toast } from '../../types';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ToastService {
    private toastSubject: BehaviorSubject<Toast[]> = new BehaviorSubject<Toast[]>([]);
    public toast$: Observable<Toast[]> = this.toastSubject.asObservable();
    
    public newToast(type: 'error' | 'info' | 'success', message: string) {
        const current = this.toastSubject.getValue();
        let state: 'open' | 'closed' | 'closing' = "open";

        if (current.length > 0) state = "closed";
        else setTimeout(() => { this.closeToast(); }, 2500);

        const new_toast: Toast = { state, type, message }
        this.toastSubject.next([...current, new_toast]);
    }

    private closeToast() {
        const current = this.toastSubject.getValue();
        if (current.length < 1) return;
        current[0].state = "closing";
        this.toastSubject.next(current);
        setTimeout(() => { this.removeToast(); }, 300);
    }

    private removeToast() {
        const current = this.toastSubject.getValue();
        if (current.length < 1) return;
        current[0].state = "closed";
        this.toastSubject.next(current)
        setTimeout(() => {
            current.shift();
            if (current.length > 0) {
                current[0].state = "open";
                setTimeout(
                    () => { this.closeToast(); },
                    current.length > 1 ? 500 : 2500
                );
            }
            this.toastSubject.next(current);
        }, 100);
    }
}
