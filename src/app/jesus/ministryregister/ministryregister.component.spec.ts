import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinistryregisterComponent } from './ministryregister.component';

describe('MinistryregisterComponent', () => {
  let component: MinistryregisterComponent;
  let fixture: ComponentFixture<MinistryregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MinistryregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinistryregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
