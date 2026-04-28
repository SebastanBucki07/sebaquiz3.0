import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamiliadaFormComponent } from './familiada-form.component';

describe('FamiliadaFormComponent', () => {
  let component: FamiliadaFormComponent;
  let fixture: ComponentFixture<FamiliadaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamiliadaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamiliadaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
