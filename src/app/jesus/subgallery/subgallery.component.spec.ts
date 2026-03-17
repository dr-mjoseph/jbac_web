import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubgalleryComponent } from './subgallery.component';

describe('SubgalleryComponent', () => {
  let component: SubgalleryComponent;
  let fixture: ComponentFixture<SubgalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubgalleryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubgalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
