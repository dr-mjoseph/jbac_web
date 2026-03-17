import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyNewsComponent } from './survey-news.component';

describe('SurveyNewsComponent', () => {
  let component: SurveyNewsComponent;
  let fixture: ComponentFixture<SurveyNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyNewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
