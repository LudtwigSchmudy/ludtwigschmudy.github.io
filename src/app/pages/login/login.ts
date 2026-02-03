import { Component, inject } from '@angular/core';
import { AccountService } from '../../services/account';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, MatIcon, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
    isLoading: boolean = false;
    loginForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6)
        ]),
    });
    errorMessage: string = '';
    private router = inject(Router);

    constructor(private authService: AccountService) {
        if (this.authService.getUser() !== null) {
            this.router.navigate(['/'])
        }
        this.authService.user.subscribe((user: any) => {
            if (user !== null) {
                this.router.navigate(['/'])
            }
        })
    }

    async handleLogin(e: Event) {
        e.preventDefault();
        this.isLoading = true;

        const form = this.loginForm.value;

        if (!form.email || !form.password) return;

        const result = await this.authService.loginEmail(form.email, form.password);

        if (result.error) {
            this.errorMessage = 'Error: ' + result.value;
        }
        
        this.isLoading = false;
    }

    async handleGoogleSignIn(e: Event) {
        e.preventDefault();
        this.isLoading = true;

        const result = await this.authService.loginGoogle();

        if (result.error) {
            this.errorMessage = 'Error: ' + result.value;
        }
        
        this.isLoading = false;
    }
}
