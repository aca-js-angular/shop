import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Products{
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  discount: number;
}


@Injectable({
  providedIn: 'root'
})
export class ProductsControlService {

  constructor(private http: HttpClient) { }

  getAllProducts(url: string = '.....'): Observable<object> { 
    return this.http.get<Products[]>(url);
  }

  searchProduct(searchValue: string, url: string = '.....'): Observable<object> {
    return this.http.get(`${url}?name=${searchValue}`);
  }

}
