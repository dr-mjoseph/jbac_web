import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ap1croreBelieversComponent } from './ap1crore-believers.component';

describe('Ap1croreBelieversComponent', () => {
  let component: Ap1croreBelieversComponent;
  let fixture: ComponentFixture<Ap1croreBelieversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ap1croreBelieversComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ap1croreBelieversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
