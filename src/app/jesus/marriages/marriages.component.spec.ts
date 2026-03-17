import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarriagesComponent } from './marriages.component';

describe('MarriagesComponent', () => {
  let component: MarriagesComponent;
  let fixture: ComponentFixture<MarriagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarriagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarriagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
