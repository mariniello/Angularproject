import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { ToastyService } from 'ng2-toasty';
import { NotAutheticatedError } from 'app/seguranca/money-http';

@Injectable()
export class ErroHandlerService {

  constructor(
    private toasty: ToastyService, 
    private router: Router
    ) { }

  handle(errorResponse: any) {

    let msg: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    }else if (errorResponse instanceof NotAutheticatedError){

      msg = 'Sua sessão expirou!';
      this.router.navigate(['/login']);

    }else if (errorResponse instanceof Response &&
              errorResponse.status >= 400 && errorResponse.status <= 499) {

      let errors;

       msg = 'Ocorreu um erro ao processar a sua solicitação.'

    if (errorResponse.status === 403) {
                    
      msg = 'Voçê não tem permissão para executar essa ação!'
    }

     try {
          errors = errorResponse.json();

          msg = errors[0].mensagemUsuario;
     }catch (e) {}
          console.error('Ocorreu um erro', errorResponse);

    } else {

          msg = 'Erro ao processar serviço remoto. Tente novamente.';
          console.log('Ocorreu um erro', errorResponse);
           }

    this.toasty.error(msg);
  }

}
