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