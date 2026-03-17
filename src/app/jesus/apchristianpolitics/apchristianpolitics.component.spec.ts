import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApchristianpoliticsComponent } from './apchristianpolitics.component';

describe('ApchristianpoliticsComponent', () => {
  let component: ApchristianpoliticsComponent;
  let fixture: ComponentFixture<ApchristianpoliticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApchristianpoliticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApchristianpoliticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
