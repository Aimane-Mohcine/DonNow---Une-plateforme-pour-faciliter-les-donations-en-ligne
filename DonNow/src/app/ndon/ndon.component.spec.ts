import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdonComponent } from './ndon.component';

describe('NdonComponent', () => {
  let component: NdonComponent;
  let fixture: ComponentFixture<NdonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NdonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NdonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
