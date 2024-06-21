import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();

  constructor(private service: LivroService) {}

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    //delays the execution of the pipe method
    debounceTime(PAUSA),
    distinctUntilChanged(),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    tap(() => console.log('Requisição ao servidor')),
    map((items: Item[]) => this.livrosResultadoParaLivros(items))
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    // Retorna um novo array a partir do array de items. A partir de cada item do array original, cria uma nova instância de livroVolumeInfo. Isto é uma versão mais elegante da solução anterior que criava um objeto do tipo Livro e atribuía a uma propriedade desta classe (classe ListaLivrosComponent), que era em seguida inserida num array de livros por meio do método push (verificar esta versão antiga no histórico do git).
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
