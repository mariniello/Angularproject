import { ToastyService } from 'ng2-toasty';
import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { CategoriaService } from './../../categorias/categoria.service';
import { ErroHandlerService } from './../../core/erro-handler.service';
import { PessoaService } from './../../pessoas/pessoa.service';
import { Lancamento, Categoria } from './../../core/model';
import { LancamentoService } from './../lancamento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-lancamentos-cadastro',
  templateUrl: './lancamentos-cadastro.component.html',
  styleUrls: ['./lancamentos-cadastro.component.css']
})
export class LancamentosCadastroComponent implements OnInit {


  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];
  pessoas = [];
  lancamento = new Lancamento();
  categoria = new Categoria();

  constructor(
    private categoriaService: CategoriaService,
    private errorHandler: ErroHandlerService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private toasty: ToastyService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {

    const codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo Lançamento');

    if (codigoLancamento) {
      this.carregarLancamento(codigoLancamento);
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  get editando() {
    return Boolean(this.lancamento.codigo);
  }

  carregarLancamento(codigo: number) {

    this.lancamentoService.buscarPorCodigo(codigo)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  salvar(form: FormControl) {

    if (this.editando) {
      this.atualizarLancamento(form);
    }else {
      this.adicionarLancamento(form);
    }
  }

  adicionarLancamento(form: FormControl) {
    this.lancamentoService.adicionar(this.lancamento)
      .then(lancamentoAdicionado => {
          this.toasty.success('Lançamento adicionado com sucesso!');

          // form.reset();
          // this.lancamento = new Lancamento();
          this.router.navigate(['/lancamentos/', lancamentoAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro))
  }

  atualizarLancamento(form: FormControl) {

    this.lancamentoService.atualizar(this.lancamento)
      .then(lancamento => {
        this.lancamento = lancamento;
        this.toasty.success('Lançamento alterado com sucesso!');
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarCategorias() {
    return this.categoriaService.listarTodas()
      .then( categorias => {
        this.categorias = categorias.map(c => ({ label: c.nome, value: c.codigo }));
                // this.categorias = categorias.map(c => {
        //   return { label: c.nome, value: c.codigo };
      })
      .catch(erro => this.errorHandler.handle(erro))
  }

  carregarPessoas() {
    return this.pessoaService.listarTodas()
      .then( pessoas => {
        this.pessoas = pessoas.map(p => ({ label: p.nome, value: p.codigo }));
                // this.pessoas = pessoas.map(c => {
        //   return { label: c.nome, value: c.codigo };
      })
      .catch(erro => this.errorHandler.handle(erro))
  }

  novo(form: FormControl) {

    form.reset();
    // Para não zerar o formulario por completo, foi necessario fazer o timeout com  1 milesegundo
    // Para iniciar a instancia de Lancamento que já vem com o botoão Receito por default
    // é um recurso do JavaScript
    setTimeout(function() {
      this.lancamento = new Lancamento();
    }.bind(this), 1);
    this.router.navigate(['/lancamentos/novo'])
  }


  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de lançamentos: ${this.lancamento.descricao}`);
  }

}
