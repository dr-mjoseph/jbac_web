import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchregisterComponent } from './churchregister.component';

describe('ChurchregisterComponent', () => {
  let component: ChurchregisterComponent;
  let fixture: ComponentFixture<ChurchregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChurchregisterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChurchregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
