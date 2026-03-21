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

    openEditForm(item: Product | null) {
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
    confirmDelete(modal: HTMLDivElement) {
        if (!this.selectedItem) return;
        this.deleteLoading = true;
        this.appService
            .manageItem({
                itemData: JSON.stringify(this.selectedItem),
                action: 'delete'
            })
            .then(result => {
                console.log(result);
                this.products = this.products.filter(itm => {
                    console.log('Item\'s id:', itm.id);
                    console.log('Resulting id:', result.replaceAll('"', ''));
                    return itm.id != result.replaceAll('"', '')
                });
                this.deleteLoading = false;
                this.closeDeletePopup(modal);
            })
            .catch(error => {
                console.error(error);
                this.deleteLoading = false;
            })
    }
    closeDeletePopup(modal: HTMLDivElement) {
        modal.classList.remove('popup-modal');
        modal.classList.add('modal-closing');
        setTimeout(() => {
            this.selectedItem = null;
            this.showDeletePopup = false;
        }, 150);
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
                .uploadSongFile(
                    input.files[0],
                    (this.selectedItem.type === "Track" ?
                    this.selectedItem?.album :
                    this.selectedItem?.title) || ""
                )
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

    handleFormSubmit(modal: HTMLDivElement) {
        if (this.shopItemForm.invalid) return;
        this.editLoading = true;
        this.shopItemForm.patchValue({ price: this.calculatePrice() })
        console.log(this.shopItemForm.value);
        const fVal = this.shopItemForm.value;
        if (fVal.type === "Track") {
            delete fVal.songAmount;
        }
        else if (fVal.type === "Album") {
            delete fVal.album;
        }
        
        if (this.selectedItem) {
            this.appService
                .manageItem({
                    itemData: JSON.stringify({
                        id: this.selectedItem.id,
                        ...this.shopItemForm.value
                    }),
                    action: 'edit'
                })
                .then(result => {
                    if (result) {
                        const r = JSON.parse(result);
                        console.log(r);
                        this.products = this.products.map(itm => {
                            if (itm.id === r.id) {
                                return r;
                            } else {
                                return itm;
                            }
                        })
                    }
                    this.editLoading = false;
                    this.closeForm(modal);
                })
                .catch(error => {
                    console.error(error);
                    this.editLoading = false;
                })
        }
        else {
            delete fVal.id;
            this.appService
                .manageItem({
                    itemData: JSON.stringify(this.shopItemForm.value),
                    action: 'create'
                })
                .then(result => {
                    if (result) {
                        const r = JSON.parse(result);
                        console.log(r);
                        this.products.splice(
                            this.products.findIndex(itm => {
                                return itm.active === r.active &&
                                       itm.type === r.type;
                            }),
                            0,
                            r
                        )
                    }
                    this.editLoading = false;
                    this.closeForm(modal);
                })
                .catch(error => {
                    console.error(error);
                    this.editLoading = false;
                })
        }
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
