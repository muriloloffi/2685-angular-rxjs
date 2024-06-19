import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'autoria'
})
export class AutoriaPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
