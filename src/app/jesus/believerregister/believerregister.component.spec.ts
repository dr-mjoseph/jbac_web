import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BelieverregisterComponent } from './believerregister.component';

describe('BelieverregisterComponent', () => {
  let component: BelieverregisterComponent;
  let fixture: ComponentFixture<BelieverregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BelieverregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BelieverregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
