import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuppRegComponent } from './supp-reg.component';

describe('SuppRegComponent', () => {
  let component: SuppRegComponent;
  let fixture: ComponentFixture<SuppRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuppRegComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuppRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
