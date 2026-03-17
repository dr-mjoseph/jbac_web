import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddadsComponent } from './addads.component';

describe('AddadsComponent', () => {
  let component: AddadsComponent;
  let fixture: ComponentFixture<AddadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
