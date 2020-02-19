import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

import { AuthService } from './../auth.service';
import { ErroHandlerService } from 'app/core/erro-handler.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(
    private auth: AuthService,
    private errorHandler: ErroHandlerService,
    private router: Router
    ) { }

    login(usuario: string, senha: string){
      this.auth.login(usuario, senha)
        .then(() => {
          this.router.navigate(['/lancamentos']);
        })
        .catch(erro => {
            this.errorHandler.handle(erro);
        });
    }
  

  ngOnInit() {

  }

}
