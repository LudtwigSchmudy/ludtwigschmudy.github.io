import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.html',
  styleUrl: './success.scss',
})
export class Success {
    seconds = signal(5);

    constructor() {
        const countdown = setInterval(() => {
            this.seconds.update(s => s - 1);
            if (this.seconds() <= 0) {
                clearInterval(countdown);
                window.close();
            }
        }, 1000);
    }
    closeWindow() {
        window.close();
    }
}
