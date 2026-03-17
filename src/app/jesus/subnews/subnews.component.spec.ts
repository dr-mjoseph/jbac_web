import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnewsComponent } from './subnews.component';

describe('SubnewsComponent', () => {
  let component: SubnewsComponent;
  let fixture: ComponentFixture<SubnewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubnewsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubnewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
