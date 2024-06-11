import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoResultadosComponent } from './ingreso-resultados.component';

describe('IngresoResultadosComponent', () => {
  let component: IngresoResultadosComponent;
  let fixture: ComponentFixture<IngresoResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IngresoResultadosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IngresoResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
