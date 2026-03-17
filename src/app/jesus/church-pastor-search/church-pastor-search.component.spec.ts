import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChurchPastorSearchComponent } from './church-pastor-search.component';

describe('ChurchPastorSearchComponent', () => {
  let component: ChurchPastorSearchComponent;
  let fixture: ComponentFixture<ChurchPastorSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChurchPastorSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChurchPastorSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
