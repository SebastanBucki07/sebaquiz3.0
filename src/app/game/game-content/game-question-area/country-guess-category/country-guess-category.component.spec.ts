import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CountryGuessCategoryComponent} from './country-guess-category.component';


describe('AppCountryGuessCategoryComponent', () => {
  let component: CountryGuessCategoryComponent;
  let fixture: ComponentFixture<CountryGuessCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryGuessCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryGuessCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
