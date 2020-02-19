import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { ToastyService } from 'ng2-toasty';
import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';

import { PessoaFiltro, PessoaService } from './../pessoa.service';
import { ErroHandlerService } from './../../core/erro-handler.service';

@Component({
  selector: 'app-pessoa-pesquisa',
  templateUrl: './pessoa-pesquisa.component.html',
  styleUrls: ['./pessoa-pesquisa.component.css']
})
export class PessoaPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas = [];
  @ViewChild('tabela') grid;

  constructor(
    private pessoaService: PessoaService,
    private toasty: ToastyService,
    private errorHandler: ErroHandlerService,
    private confirmation: ConfirmationService,
    private title: Title
    ) { }

    ngOnInit() {
      this.title.setTitle('Pesquisa de pessoas');
    }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.pessoaService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {

    this.pessoaService.excluir(pessoa.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        }else {
          this.grid.first = 0;
        }

        this.toasty.success('Lançamento excluído com sucesso!');

      })
      .catch(erro => this.errorHandler.handle(erro));
 }

 alternarStatus(pessoa: any): void {
   const novoStatus = !pessoa.ativo;

   this.pessoaService.mudarStatus(pessoa.codigo, novoStatus)
    .then(() => {
      const acao = novoStatus ? 'Ativada' : 'Desativada';

      pessoa.ativo = novoStatus;
      this.toasty.success(`Pessoa ${acao} com sucesso!`);
    })
    .catch(erro => this.errorHandler.handle(erro));
 }

}
