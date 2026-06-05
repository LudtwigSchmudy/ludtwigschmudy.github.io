import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import {
    connectFunctionsEmulator,
    Functions,
    getFunctions,
    httpsCallable
} from 'firebase/functions';
import { getStorage, ref, uploadBytes, getMetadata } from "firebase/storage";
import { DownloadFiles, Product, PurchaseData } from '../../../types';

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
    private functions: Functions;
    private storage;
    constructor() {
        this.app = initializeApp(firebaseConfig);
        this.functions = getFunctions(this.app);
        this.storage = getStorage(this.app);

        // connectFunctionsEmulator(this.functions, 'localhost', 5001);
    }

    public basifyName(name: string): string {
        return name
            .toLowerCase()
            .replaceAll(' - ', '-')
            .split(' ')
            .join('-')
            .replaceAll(/(\,|\')/g, '');
    }

    public async createCheckoutSession(data: any) {
        try {
            const fn = httpsCallable(this.functions, 'createCheckoutSession');
            const result = await fn(data);
            return result.data;
        } catch(error) {
            console.log(error);
            return null;
        }
    }

    public async getPurchases(data: any) {
        const fn = httpsCallable(this.functions, 'getPurchases');
        const result = await fn(data);
        console.log(result.data);
        return result.data as PurchaseData;
    }

    public async getStatus(data: any) {
        const fn = httpsCallable(this.functions, 'getStatus');
        const result = await fn(data);
        return result.data;
    }

    public async getSessionDownloads(data: any): Promise<DownloadFiles[] | null> {
        const fn = httpsCallable(this.functions, 'getSessionDownload');
        const result = await fn(data);
        return result.data as DownloadFiles[] | null;
    }

    public async getPurchaseDownloads(): Promise<DownloadFiles[] | null> {
        const fn = httpsCallable(this.functions, 'getPurchaseDownloads');
        const result = await fn();
        return result.data as DownloadFiles[] | null;
    }

    public async savePurchases(data: any): Promise<void> {
        const fn = httpsCallable(this.functions, 'savePurchases');
        await fn(data);
    }

    public async isManager(): Promise<boolean> {
        const result = await httpsCallable(this.functions, 'isManager')();
        return result.data as boolean;
    }

    public async getShopItems(options: {
        searchQuery?: string,
        typeFilter?: "Track" | "Album" | "",
        active?: boolean
    }) {
        const result = await httpsCallable(this.functions, 'getShopItems')(options);
        return result.data as Product[];
    }

    public async manageItem(data: { itemData: string, action: 'create' | 'edit' | 'delete' }): Promise<string> {
        const result = await httpsCallable(this.functions, 'manageItem')(data);
        return '' + result.data;
    }

    public getInstance() {
        return this.app;
    }

    public async uploadSongFile(file: File | FileList, title: string): Promise<Array<{ name: string, uploaded: boolean, path: string, error?: any }>> {
        const results: Array<{ name: string, uploaded: boolean, path: string, error?: any }> = [];

        const uploadIfNotExists = async (fileObj: File, path: string) => {
            const fileRef = ref(this.storage, path);
            try {
                await getMetadata(fileRef);
                results.push({ name: fileObj.name, uploaded: false, path, error: 'exists' });
            } catch (e: any) {
                const isNotFound = e && (e.code === 'storage/object-not-found' || e.code === 'storage/object_not_found');
                if (!isNotFound) {
                    results.push({ name: fileObj.name, uploaded: false, path, error: e });
                    return;
                }

                try {
                    await uploadBytes(fileRef, fileObj, { contentType: fileObj.type || 'application/octet-stream' });
                    results.push({ name: fileObj.name, uploaded: true, path });
                } catch (uploadErr) {
                    results.push({ name: fileObj.name, uploaded: false, path, error: uploadErr });
                }
            }
        };

        if (file instanceof File) {
            const path = `songs/${this.basifyName(title)}/${this.basifyName(file.name)}`;
            await uploadIfNotExists(file, path);
        } else if (file instanceof FileList) {
            const tasks: Promise<void>[] = [];
            for (let i = 0; i < file.length; i++) {
                const fileInstance = file.item(i)!;
                const path = `songs/${this.basifyName(title)}/${this.basifyName(fileInstance.name)}`;
                tasks.push(uploadIfNotExists(fileInstance, path));
            }
            await Promise.all(tasks);
        }

        return results;
    }
}
