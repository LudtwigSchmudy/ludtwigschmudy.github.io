import { Injectable } from '@angular/core';
import {
    getAuth,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from "firebase/auth";
import { Subject } from 'rxjs';
import { User } from '../../../types';
import { FirebaseApp } from '../firebase-app/firebase-app';





@Injectable({
    providedIn: 'root',
})
export class AccountService {
    private app;
    public user = new Subject<any>();
    
    constructor(private readonly appService: FirebaseApp) {
        this.app = this.appService.getInstance();

        onAuthStateChanged(
            getAuth(this.app),
            this.user,
            (err) => {
                console.error('User update error:', err);
            }
        )
    }

    public getUser(): User | null {
        const auth = getAuth(this.app);
        const user = auth.currentUser as User | null;

        return user ? user : null;
    }

    public async newLoginEmail(email: string, password: string) {
        const auth = getAuth(this.app);

        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);

            if (result) {
                return {
                    error: false,
                    value: result.user
                };
            } else {
                return {
                    error: true,
                    value: "Couldn't find your account"
                };
            }
        } catch(error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`
========================
<WARNING ERROR OCCURRED>
========================
Code:     ${errorCode}
Message:  ${errorMessage}
========================\n\n`
            );
            return {
                error: true,
                value: errorCode.toString().split('/')[1].split('-').join(' ')
            };
        }
    }

    public async loginEmail(email: string, password: string) {
        const auth = getAuth(this.app);

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);

            if (result) {
                return {
                    error: false,
                    value: result.user
                };
            } else {
                return {
                    error: true,
                    value: "Couldn't find your account"
                };
            }
        } catch(error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`
========================
<WARNING ERROR OCCURRED>
========================
Code:     ${errorCode}
Message:  ${errorMessage}
========================\n\n`
            );
            return {
                error: true,
                value: errorCode.toString().split('/')[1].split('-').join(' ')
            };
        }
    }

    public async loginGoogle() {
        const auth = getAuth(this.app);

        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());

            if (result) {
                return {
                    error: false,
                    value: result.user
                };
            } else {
                return {
                    error: true,
                    value: "Couldn't find your account"
                };
            }
        } catch(error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.error(`
========================
<WARNING ERROR OCCURRED>
========================
Code:       ${errorCode}
Message:    ${errorMessage}
Email:      ${email}
Credential: ${credential}
========================\n\n`
            );
            return {
                error: true,
                value: errorCode.toString().split('/')[1].split('-').join(' ')
            };
        }
    }

    public async signOut() {
        const auth = getAuth(this.app);
        try {
            await signOut(auth);
            return true;
        } catch(error) {
            console.error(error);
            return false;
        }
    }
}
