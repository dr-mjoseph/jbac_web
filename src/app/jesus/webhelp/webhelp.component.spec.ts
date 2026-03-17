import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebhelpComponent } from './webhelp.component';

describe('WebhelpComponent', () => {
  let component: WebhelpComponent;
  let fixture: ComponentFixture<WebhelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebhelpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebhelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
