import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastorassociationregisterComponent } from './pastorassociationregister.component';

describe('PastorassociationregisterComponent', () => {
  let component: PastorassociationregisterComponent;
  let fixture: ComponentFixture<PastorassociationregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastorassociationregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastorassociationregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
