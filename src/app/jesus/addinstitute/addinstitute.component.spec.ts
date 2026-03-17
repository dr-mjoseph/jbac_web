import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddinstituteComponent } from './addinstitute.component';

describe('AddinstituteComponent', () => {
  let component: AddinstituteComponent;
  let fixture: ComponentFixture<AddinstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddinstituteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddinstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
