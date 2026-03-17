import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechsolComponent } from './techsol.component';

describe('TechsolComponent', () => {
  let component: TechsolComponent;
  let fixture: ComponentFixture<TechsolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechsolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechsolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
