import { TestBed } from '@angular/core/testing';

import { ShopItem } from './shop-item';

describe('ShopItem', () => {
  let service: ShopItem;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopItem);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
