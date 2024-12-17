import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FMPassComponent } from './fm-pass.component';

describe('FMPassComponent', () => {
  let component: FMPassComponent;
  let fixture: ComponentFixture<FMPassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FMPassComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FMPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
