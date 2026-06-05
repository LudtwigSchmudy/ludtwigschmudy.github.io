import { TestBed } from '@angular/core/testing';

import { Platforms } from './platforms';

describe('Platforms', () => {
  let service: Platforms;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Platforms);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
