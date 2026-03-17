import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchTimingsComponent } from './church-timings.component';

describe('ChurchTimingsComponent', () => {
  let component: ChurchTimingsComponent;
  let fixture: ComponentFixture<ChurchTimingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChurchTimingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChurchTimingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
