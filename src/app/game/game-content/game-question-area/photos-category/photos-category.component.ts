import {Component, OnInit} from '@angular/core';
import {Category} from '../../../../shared/category/category.interface';
import {CATEGORY_LIST} from '../../../../shared/category/categoryList';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-photos-category',
  imports: [],
  templateUrl: './photos-category.component.html',
  styleUrl: './photos-category.component.css'
})
export class PhotosCategoryComponent implements OnInit{
  category!: Category;


  constructor(private route: ActivatedRoute) {}


  ngOnInit(): void {
// pobieramy parametr z rodzica
    const parent = this.route.parent?.snapshot.paramMap;
    const name = parent?.get('name');
    const type = parent?.get('type');
    this.category = CATEGORY_LIST.find(c => c.name === name && c.type === type)!;
  }
}
