import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChristianattackvideoComponent } from './christianattackvideo.component';

describe('ChristianattackvideoComponent', () => {
  let component: ChristianattackvideoComponent;
  let fixture: ComponentFixture<ChristianattackvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChristianattackvideoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChristianattackvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
