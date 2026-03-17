import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurhelpComponent } from './ourhelp.component';

describe('OurhelpComponent', () => {
  let component: OurhelpComponent;
  let fixture: ComponentFixture<OurhelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OurhelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurhelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
