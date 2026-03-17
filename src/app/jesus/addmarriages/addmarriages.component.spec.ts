import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmarriagesComponent } from './addmarriages.component';

describe('AddmarriagesComponent', () => {
  let component: AddmarriagesComponent;
  let fixture: ComponentFixture<AddmarriagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmarriagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddmarriagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
