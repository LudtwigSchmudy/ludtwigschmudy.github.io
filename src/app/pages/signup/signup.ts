import { Component, inject } from '@angular/core';
import { AccountService } from '../../services/account';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, MatIcon, RouterLink],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
})
export class SignUp {
    isLoading: boolean = false;
    signUpForm = new FormGroup({
        email: new FormControl('', [
            Validators.required,
            Validators.email
        ]),
        password: new FormControl('', [
            Validators.required,
            Validators.minLength(6)
        ]),
        confirm_password: new FormControl('', [
            Validators.required,
            Validators.minLength(6),
            (control: AbstractControl): ValidationErrors | null => {
                const parent = control.parent as FormGroup | null;
                if (!parent) return null;
                const password = parent.get('password')?.value;
                if (control.value === password) return null;
                return { match: true };
            }
        ]),
    });
    errorMessage: string = '';

    errors = {
        "email": {
            "required": 'An email is required',
            "email": 'Enter a valid email',
        },
        "password": {
            "required": 'Password is required',
            "minlength": 'Password is too short',
        },
        "confirm_password": {
            "required": 'Please confirm your password',
            "minlength": 'Password is too short',
            "match": 'Passwords must match',
        }
    }
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

    filterErrors(formErrors: any) {
        let error = '';
        type EmailKey = keyof typeof this.errors.email;
        type PassKey = keyof typeof this.errors.password;
        type MatchKey = keyof typeof this.errors.confirm_password;
        
        if (formErrors.email) {
            error = this.errors.email[Object.keys(formErrors.email)[0] as EmailKey];
        } else if (formErrors.password) {
            error = this.errors.password[Object.keys(formErrors.password)[0] as PassKey];
        } else if (formErrors.confirm_password) {
            error = this.errors.confirm_password[Object.keys(formErrors.confirm_password)[0] as MatchKey];
        }

        return error;
    }

    async handleSignUp(e: Event) {
        e.preventDefault();
        this.isLoading = true;

        const form = this.signUpForm.value;

        console.warn(this.signUpForm.value);
        if (!form.email || !form.password) return;

        const result = await this.authService.newLoginEmail(form.email, form.password);

        if (result.error) {
            this.errorMessage = 'Error: ' + result.value;
        }
        console.warn('SignUp Result\n> ' + result.value);
        
        this.isLoading = false;
    }

    async handleGoogleSignUp(e: Event) {
        e.preventDefault();
        this.isLoading = true;

        const result = await this.authService.loginGoogle();

        if (result.error) {
            this.errorMessage = 'Error: ' + result.value;
        }
        console.warn('Google SignUp\n>', result.value);
        
        this.isLoading = false;
    }
}
