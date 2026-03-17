import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamoduComponent } from './namodu.component';

describe('NamoduComponent', () => {
  let component: NamoduComponent;
  let fixture: ComponentFixture<NamoduComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NamoduComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NamoduComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
