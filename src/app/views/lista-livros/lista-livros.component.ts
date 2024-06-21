import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  EMPTY,
  catchError,
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
  mensagemErro = '';

  constructor(private service: LivroService) {}

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    //a ordem dos operadores abaixo é importante
    //delays the execution of the pipe method
    debounceTime(PAUSA),
    //stops if the search term is smaller than 3
    filter((valorDigitado) => valorDigitado.length >= 3),
    //doesn't send a new request to api if the search query is the same
    distinctUntilChanged(),
    //atualiza a saída, mas interrompe a requisição se o valor de query muda
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    //debug message
    tap(() => console.log('Requisição ao servidor')),
    //atualiza a saída com base no callback provido
    map((items: Item[]) => this.livrosResultadoParaLivros(items)),
    catchError(erro => {
      this.mensagemErro = 'Ops, ocorreu um erro. Recarregue a aplicação.';
      return EMPTY;
    })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    // Retorna um novo array a partir do array de items. A partir de cada item do array original, cria uma nova instância de livroVolumeInfo. Isto é uma versão mais elegante da solução anterior que criava um objeto do tipo Livro e atribuía a uma propriedade desta classe (classe ListaLivrosComponent), que era em seguida inserida num array de livros por meio do método push (verificar esta versão antiga no histórico do git).
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
