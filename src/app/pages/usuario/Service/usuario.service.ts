import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Usuario } from '../Models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private url = environment.apiUrl;
  options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    body: {
    },
  };
  constructor(
    private httpClient: HttpClient
    ) { }

  BuscarTodos()
  {
    return this.httpClient.get<Usuario[]>(`${this.url}/Usuario/BuscarTodos`);
  }
  RemoverUsuario(usuario: Usuario)
  {
    this.options.body = usuario;
    return this.httpClient.delete(`${this.url}/Usuario/Remover`, this.options)
  }

  AdicionarUsuario(usuario: Usuario){
    return this.httpClient.post(`${this.url}/Usuario/Adicionar`, usuario);
  }

  AtualizarUsuario(usuario: Usuario){
    return this.httpClient.put(`${this.url}/Usuario/Atualizar`, usuario);
  }
}
