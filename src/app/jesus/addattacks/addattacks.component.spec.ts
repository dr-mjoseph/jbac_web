import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddattacksComponent } from './addattacks.component';

describe('AddattacksComponent', () => {
  let component: AddattacksComponent;
  let fixture: ComponentFixture<AddattacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddattacksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddattacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
