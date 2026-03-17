import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastorregisterComponent } from './pastorregister.component';

describe('PastorregisterComponent', () => {
  let component: PastorregisterComponent;
  let fixture: ComponentFixture<PastorregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastorregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastorregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
