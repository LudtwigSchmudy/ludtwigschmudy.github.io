export type Song = {
    "title": string;
    "type": "single" | "ep" | "album";
    "release": Date;
    "cover": string;
    "links": {
        "spotify"?: string;
        "apple"?: string;
        "youtube"?: string;
        "others"?: string;
    };
    "songs"?: string[];
    "presave"?: string;
}
export type Item = {
    "name": string;
    "price": number;
    "image": string;
    "type": "clothing" | "miscellaneous" | "cd" | "digital";
    "size"?: "S" | "M" | "L" | "XL" | "XXL";
    "color"?: string;
    "externalLink"?: string;
}
export type Post = {
    "title": string;
    "date": Date;
    "content": string;
    "link"?: string;
}
export type Platform = {
    "name": string;
    "url": string;
    "image": string;
}
export type User = {
    "displayName": string;
    "email": string;
    "metadata": {
        "createdAt": string;
        "creationTime": string;
        "lastLoginAt": string;
        "lastSignInTime": string;
    };
    "photoURL": string;
}




export type Product = {
    "id"?: string;
    "title": string;
    "description"?: string;
    "imageURL": string;
    "active": boolean;
    "price": number;
    "type": string;
    "songAmount"?: number;
    "album"?: string;
}

export type CartItem = {
    "productId": string;
    "name": string;
    "price": number;
    "quantity": number;
}

export type Price = {
    "albumTitle"?: string;
    "productId": string;
    "type": string;
}

export type StripeItem = {
    "price_data": {
        "currency": "USD";
        "product": string;
    };
    "quantity": number;
    "fbId": string;
}

export type CloudCart = {
    "cartData": string;
    "createdAt": string;
    "updatedAt"?: string;
}

