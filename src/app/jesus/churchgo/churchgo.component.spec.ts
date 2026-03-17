import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchgoComponent } from './churchgo.component';

describe('ChurchgoComponent', () => {
  let component: ChurchgoComponent;
  let fixture: ComponentFixture<ChurchgoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChurchgoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChurchgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
