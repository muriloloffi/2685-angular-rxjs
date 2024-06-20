import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Item, LivrosResultado } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LivroService {

  private readonly API = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  buscar(valorDigitado: string): Observable<Item[]> {
    if (valorDigitado) {
      const params = new HttpParams().append('q', valorDigitado);
      return this.http.get<LivrosResultado>(this.API, { params }).pipe(
        map(resultado => resultado.items),
        catchError(error => {
          console.error('Erro na busca: ', error);
          return of([]);
        })
      )
    } else {
      return of([]);
    }
  }
}
