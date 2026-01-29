import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliadaComponent } from './familiada.component';

describe('FamiliadaComponent', () => {
  let component: FamiliadaComponent;
  let fixture: ComponentFixture<FamiliadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamiliadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamiliadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
