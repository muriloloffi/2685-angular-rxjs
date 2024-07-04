import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';
import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
  keyframes,
} from '@angular/animations';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-50px)' }),
            stagger('100ms', [
              animate(
                '500ms ease-out',
                keyframes([
                  style({
                    opacity: 0,
                    transform: 'translateY(-50px)',
                    offset: 0,
                  }),
                  style({
                    opacity: 0.5,
                    transform: 'translateY(-25px)',
                    offset: 0.3,
                  }),
                  style({ opacity: 1, transform: 'none', offset: 1 }),
                ])
              ),
            ]),
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            stagger('100ms', [
              animate(
                '500ms ease-out',
                keyframes([
                  style({ opacity: 1, transform: 'none', offset: 0 }),
                  style({
                    opacity: 0.5,
                    transform: 'translateY(-25px)',
                    offset: 0.3,
                  }),
                  style({
                    opacity: 0,
                    transform: 'translateY(-50px)',
                    offset: 1,
                  }),
                ])
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class ListaLivrosComponent {
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

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

    map((resultado) => (this.livrosResultado = resultado)),
    //debug message
    tap(() => console.log('Requisição ao servidor')),
    map((resultado) => resultado.items ?? []),

    //atualiza a saída com base no callback provido
    map((items: Item[]) => this.livrosResultadoParaLivros(items)),

    catchError((erro) => {
      console.log(erro);
      return throwError(
        () =>
          new Error(
            (this.mensagemErro =
              'Ops, ocorreu um erro. Recarregue a aplicação!')
          )
      );
    })
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    // O map retorna um novo array a partir do array de items. Para cada item do array original, é criado uma nova instância de livroVolumeInfo.
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }
}
