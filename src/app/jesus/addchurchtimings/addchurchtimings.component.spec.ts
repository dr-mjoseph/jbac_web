import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddchurchtimingsComponent } from './addchurchtimings.component';

describe('AddchurchtimingsComponent', () => {
  let component: AddchurchtimingsComponent;
  let fixture: ComponentFixture<AddchurchtimingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddchurchtimingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddchurchtimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
