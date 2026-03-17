import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddjobsComponent } from './addjobs.component';

describe('AddjobsComponent', () => {
  let component: AddjobsComponent;
  let fixture: ComponentFixture<AddjobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddjobsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddjobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
