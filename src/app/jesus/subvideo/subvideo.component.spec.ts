import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubvideoComponent } from './subvideo.component';

describe('SubvideoComponent', () => {
  let component: SubvideoComponent;
  let fixture: ComponentFixture<SubvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubvideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
