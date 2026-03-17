import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmeetingsComponent } from './addmeetings.component';

describe('AddmeetingsComponent', () => {
  let component: AddmeetingsComponent;
  let fixture: ComponentFixture<AddmeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmeetingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
