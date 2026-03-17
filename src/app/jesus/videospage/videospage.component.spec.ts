import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideospageComponent } from './videospage.component';

describe('VideospageComponent', () => {
  let component: VideospageComponent;
  let fixture: ComponentFixture<VideospageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideospageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideospageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
