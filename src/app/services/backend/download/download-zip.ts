import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { firstValueFrom } from 'rxjs';
import { DownloadFiles } from '../../../types';

@Injectable({
    providedIn: 'root',
})
export class DownloadZip {
    constructor(private http: HttpClient) {}

    async downloadZip(files: DownloadFiles[], zipName: string = 'songs.zip') {
        const zip = new JSZip();

        for (const f of files) {
            if (f.type === "Album") {
                const folder = zip.folder(f.data[0].path.split('/')[1]);

                for (const url of f.data) {
                    const filename = url.path.split('/').pop() || 'file';
                    const blob = await firstValueFrom(this.http.get(
                        url.name,
                        { responseType: 'blob' }
                    ))
                    folder?.file(filename, blob);
                }
            } else if (f.type === "Track") {
                const filename = f.data[0].path.split('/').pop() || 'file';
                const blob = await firstValueFrom(this.http.get(
                    f.data[0].name,
                    { responseType: 'blob' }
                ))
                zip.file(filename, blob)
            } else {
                console.error('Bad data received.');
            }
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        saveAs(zipBlob, zipName);
    }
}
