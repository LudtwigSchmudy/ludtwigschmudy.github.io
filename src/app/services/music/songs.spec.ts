import { TestBed } from '@angular/core/testing';

import { Songs } from './songs';

describe('Songs', () => {
  let service: Songs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Songs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
