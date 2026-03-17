import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InjusticeComponent } from './injustice.component';

describe('InjusticeComponent', () => {
  let component: InjusticeComponent;
  let fixture: ComponentFixture<InjusticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InjusticeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InjusticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
