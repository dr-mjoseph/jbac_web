import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JosephviewComponent } from './josephview.component';

describe('JosephviewComponent', () => {
  let component: JosephviewComponent;
  let fixture: ComponentFixture<JosephviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JosephviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JosephviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
