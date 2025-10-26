import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fullDateFormat' })
export class FullDateFormatPipe implements PipeTransform {
    transform(value: Date, ...args: unknown[]): unknown {
        return `${['January','February','March','April','May','June','July','August','September','October','November','December'][value.getMonth()]} ${value.getDate()}, ${value.getFullYear()}`;
    }
}
