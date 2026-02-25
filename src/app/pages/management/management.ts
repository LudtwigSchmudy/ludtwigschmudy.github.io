import { Component } from '@angular/core';
import { Product } from '../../types';
import { FirebaseApp } from '../../services/backend/firebase-app/firebase-app';
import { MatIcon } from "@angular/material/icon";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-management',
  imports: [MatIcon, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './management.html',
  styleUrl: './management.scss',
})
export class Management {
    isLoading: boolean = true;
    selectedItem: Product | null = null;
    showForm: boolean = false;
    showDeletePopup: boolean = false;
    showLinkPopup: boolean = false;
    products: Product[] = [];
    itemType: "Track" | "Album" | "" = "";
    activeType: "true" | "false" | "" = "";
    linkLoading: boolean = false;
    deleteLoading: boolean = false;
    editLoading: boolean = false;
    fileUploading: boolean = false;
    shopItemForm;


    constructor(private appService: FirebaseApp) {
        this.updateItems();
        this.shopItemForm = new FormGroup({
            id: new FormControl(this.selectedItem?.id || ''),
            title: new FormControl(this.selectedItem?.title || '', [
                Validators.required,
                Validators.minLength(4)
            ]),
            // description: new FormControl(this.selectedItem?.description || ''),
            imageURL: new FormControl(this.selectedItem?.imageURL || '/images/songs/', [
                Validators.required,
                Validators.pattern(/\/(images)\/(songs)\/(.+)\.(jpg)/)
            ]),
            active: new FormControl(this.selectedItem?.active || true),
            price: new FormControl(this.selectedItem?.price || 1, [
                Validators.required,
                Validators.min(1)
            ]),
            type: new FormControl(this.selectedItem?.type || 'Track', [
                Validators.required,
                Validators.pattern(/^(Album|Track)$/)
            ]),
            songAmount: new FormControl(this.selectedItem?.songAmount || 3, [
                Validators.min(3)
            ]),
            album: new FormControl(this.selectedItem?.album || '', [
                Validators.minLength(3),
                Validators.maxLength(50)
            ])
        })
    }

    calculatePrice() {
        const songCount = this.shopItemForm.value.type === "Track" ? 1 : this.shopItemForm.value.songAmount || 1;
        return (songCount - (Math.floor(songCount/5)));
    }

    openEditForm(item: Product) {
        this.selectedItem = item;
        this.shopItemForm = new FormGroup({
            id: new FormControl(this.selectedItem?.id || ''),
            title: new FormControl(this.selectedItem?.title || '', [
                Validators.required,
                Validators.minLength(4)
            ]),
            // description: new FormControl(this.selectedItem?.description || ''),
            imageURL: new FormControl(this.selectedItem?.imageURL || '/images/songs/', [
                Validators.required,
                Validators.pattern(/\/(images)\/(songs)\/(.+)\.(jpg)/)
            ]),
            active: new FormControl(this.selectedItem?.active || true),
            price: new FormControl(this.selectedItem?.price || 1, [
                Validators.required,
                Validators.min(1)
            ]),
            type: new FormControl(this.selectedItem?.type || 'Track', [
                Validators.required,
                Validators.pattern(/^(Album|Track)$/)
            ]),
            songAmount: new FormControl(this.selectedItem?.songAmount || 3, [
                Validators.min(3)
            ]),
            album: new FormControl(this.selectedItem?.album || '', [
                Validators.minLength(3),
                Validators.maxLength(50)
            ])
        })
        this.showForm = true;
    }
    closeForm(modal: HTMLDivElement) {
        modal.classList.remove('popup-modal');
        modal.classList.add('modal-closing');
        setTimeout(() => {
            this.selectedItem = null;
            this.showForm = false;
        }, 150);
    }

    openLinkPopup(item: Product) {
        this.selectedItem = item;
        this.showLinkPopup = true;
    }
    closeLinkPopup(modal: HTMLDivElement) {
        modal.classList.remove('popup-modal');
        modal.classList.add('modal-closing');
        setTimeout(() => {
            this.selectedItem = null;
            this.showLinkPopup = false;
        }, 150);
    }

    openDeletePopup(item: Product) {
        this.selectedItem = item;
        this.showDeletePopup = true;
    }
    confirmDelete() {
        if (this.selectedItem) this.deleteItem(this.selectedItem);
    }
    closeDeletePopup(modal: HTMLDivElement) {
        modal.classList.remove('popup-modal');
        modal.classList.add('modal-closing');
        setTimeout(() => {
            this.selectedItem = null;
            this.showDeletePopup = false;
        }, 150);
    }

    saveLinks(songs: HTMLInputElement, price: HTMLInputElement) {
        
    }

    convertName(name: string) {
        return this.appService.basifyName(name);
    }
    fileStyle(files: FileList) {
        return Array.from(files).map(file => file.name).join('\n');
    }


    handleFileUpload(input: HTMLInputElement) {
        if (!input || !input.files || !this.selectedItem) return;
        this.fileUploading = true;

        if (input.files.length > 1) {
            this.appService
                .uploadSongFile(
                    input.files,
                    this.selectedItem?.title
                )
                .then(res => {
                    console.log(res);
                    this.fileUploading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.fileUploading = false;
                })
        } else {
            this.appService
                .uploadSongFile(input.files[0])
                .then(res => {
                    console.log(res);
                    this.fileUploading = false;
                })
                .catch(err => {
                    console.log(err);
                    this.fileUploading = false;
                })
        }
    }


    private SubmitNewItem(data: any) {

    }
    private UpdateItem(data: any) {

    }
    handleFormSubmit() {
        if (this.shopItemForm.invalid) return;
        if (this.selectedItem) this.UpdateItem(this.shopItemForm.value);
        else this.SubmitNewItem(this.shopItemForm.value);
    }


    editItem(item: Product) {
        this.appService.manageItem({
            itemData: JSON.stringify(item),
            action: 'edit'
        })
    }
    deleteItem(item: Product) {
        this.appService.manageItem({
            itemData: JSON.stringify(item),
            action: 'delete'
        })
    }
    createItem(item: Product) {
        this.appService.manageItem({
            itemData: JSON.stringify(item),
            action: 'create'
        })
    }

    handleTypeChange(typeValue: any) {
        this.itemType = typeValue;
        this.updateItems();
    }
    handleActiveChange(activeState: any) {
        this.activeType = activeState;
        this.updateItems();
    }

    async updateItems() {
        this.isLoading = true;
        const newItems = await this.appService.getShopItems({
            typeFilter: this.itemType,
            active: this.activeType.length > 0 ? (
                this.activeType === 'true' ? true : false
            ) : undefined
        });
        this.products = newItems;
        console.log(newItems);
        this.isLoading = false;
    }
}
