import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupModal } from './popup-modal';

describe('PopupModal', () => {
  let component: PopupModal;
  let fixture: ComponentFixture<PopupModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
