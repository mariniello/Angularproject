
// ng g c core/pagina-nao-encontrada --inline-style --inline-template --flat --spec=false

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagina-nao-encontrada',
  template: `
  <div class="container">
    <h1 class="text-center">Página não encontrada</h1>
  <div>
  `,
  styles: []
})
export class PaginaNaoEncontradaComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
