import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WingsComponent } from './wings.component';

describe('WingsComponent', () => {
  let component: WingsComponent;
  let fixture: ComponentFixture<WingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
