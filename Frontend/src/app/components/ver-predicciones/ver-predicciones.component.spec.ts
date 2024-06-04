import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPrediccionesComponent } from './ver-predicciones.component';

describe('VerPrediccionesComponent', () => {
  let component: VerPrediccionesComponent;
  let fixture: ComponentFixture<VerPrediccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerPrediccionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerPrediccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
