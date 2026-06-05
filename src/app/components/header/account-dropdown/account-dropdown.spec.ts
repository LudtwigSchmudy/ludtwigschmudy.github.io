import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDropdown } from './account-dropdown';

describe('AccountDropdown', () => {
  let component: AccountDropdown;
  let fixture: ComponentFixture<AccountDropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDropdown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
