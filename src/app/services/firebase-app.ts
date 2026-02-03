import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDnYPpoX9IzEQeZM5ZgEbGZ_3KfGmhqKwo",
    authDomain: "ludtwig-schmudy-website.firebaseapp.com",
    projectId: "ludtwig-schmudy-website",
    storageBucket: "ludtwig-schmudy-website.firebasestorage.app",
    messagingSenderId: "796945690821",
    appId: "1:796945690821:web:19aeb670f88afb0eb300ac",
    measurementId: "G-JRQPBPYLGV"
};


@Injectable({
    providedIn: 'root',
})
export class FirebaseApp {
    private app;
    constructor() {
        this.app = initializeApp(firebaseConfig);
    }

    public getInstance() {
        return this.app;
    }
}
