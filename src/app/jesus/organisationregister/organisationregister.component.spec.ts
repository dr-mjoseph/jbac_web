import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganisationregisterComponent } from './organisationregister.component';

describe('OrganisationregisterComponent', () => {
  let component: OrganisationregisterComponent;
  let fixture: ComponentFixture<OrganisationregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganisationregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganisationregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
