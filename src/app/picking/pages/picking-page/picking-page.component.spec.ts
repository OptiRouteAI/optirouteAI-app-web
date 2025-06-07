import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickingPageComponent } from './picking-page.component';

describe('PickingPageComponent', () => {
  let component: PickingPageComponent;
  let fixture: ComponentFixture<PickingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PickingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PickingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
