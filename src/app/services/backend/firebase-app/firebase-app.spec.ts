import { TestBed } from '@angular/core/testing';

import { FirebaseApp } from './firebase-app';

describe('FirebaseApp', () => {
  let service: FirebaseApp;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseApp);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
