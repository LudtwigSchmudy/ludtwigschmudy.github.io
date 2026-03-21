import { TestBed } from '@angular/core/testing';

import { DownloadZip } from './download-zip';

describe('DownloadZip', () => {
  let service: DownloadZip;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadZip);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
