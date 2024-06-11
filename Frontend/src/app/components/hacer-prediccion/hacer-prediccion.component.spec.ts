import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HacerPrediccionComponent } from './hacer-prediccion.component';

describe('HacerPrediccionComponent', () => {
  let component: HacerPrediccionComponent;
  let fixture: ComponentFixture<HacerPrediccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HacerPrediccionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HacerPrediccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
