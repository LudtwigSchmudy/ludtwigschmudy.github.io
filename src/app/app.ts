import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { Toast } from "./components/header/toast/toast";
import { ToastService } from './services/ui/toast-service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, Header, Footer, Toast],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App {
    type: 'error' | 'info' | 'success' = 'info';
    state: 'closed' | 'open' | 'closing' = 'closed';
    message: string = '';
    constructor(private readonly toastService: ToastService) {
        this.toastService.toast$.subscribe(toast => {
            if (toast.length > 0) {
                this.type = toast[0].type;
                this.state = toast[0].state;
                this.message = toast[0].message;
            } else {
                this.type = 'info';
                this.state = 'closed';
                this.message = '';
            }
        })
    }
}
