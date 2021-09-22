import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from './Models/Usuario';
import { UsuarioService } from './Service/usuario.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  listaUsuarios: Usuario[];
  usuario: Usuario;
  modalRef?: BsModalRef;
  formularioUsuario: FormGroup;
  constructor(
    private usuarioService: UsuarioService,
    private modalService: BsModalService,
    private toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.buscarTodosUsuarios();
  }

  abrirModalRemoverUsuario(usuarioParaSerRemovido: Usuario, template: TemplateRef<any>) {
    this.usuario = usuarioParaSerRemovido;
    this.modalRef = this.modalService.show(template);
  }

  abrirModalAtualizarUsuario(usuarioParaSerAtualizado: Usuario, template: TemplateRef<any>) {
    this.construirFormularioUsuarioAtualizacao(usuarioParaSerAtualizado);
    this.modalRef = this.modalService.show(template);
  }

  abrirModalCriarUsuario(template: TemplateRef<any>) {
    this.construirFormularioUsuarioCriacao();
    this.modalRef = this.modalService.show(template);
  }

  removerUsuario() {
    this.usuarioService.RemoverUsuario(this.usuario).subscribe(() => {
      this.modalRef?.hide()
      this.buscarTodosUsuarios();
      this.toastr.success("Usuario removido", "Sucesso")
    })
  }

  buscarTodosUsuarios() {
    this.usuarioService.BuscarTodos().subscribe(data => {
      this.listaUsuarios = data;
    })
  }

  construirFormularioUsuarioCriacao() {
    this.formularioUsuario = new FormGroup({
      'id': new FormControl(0),
      'nome': new FormControl(null, Validators.required),
      'sobrenome': new FormControl(null),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'dataNascimento': new FormControl(null, [Validators.required]),
      'escolaridade': new FormControl(1, Validators.required)
    })
  }

  construirFormularioUsuarioAtualizacao(usuarioForm : Usuario){
    this.formularioUsuario = new FormGroup({
      'id': new FormControl(usuarioForm?.id),
      'nome': new FormControl(usuarioForm?.nome, Validators.required),
      'sobrenome': new FormControl(usuarioForm?.sobrenome),
      'email': new FormControl(usuarioForm?.email, [Validators.required, Validators.email]),
      'dataNascimento': new FormControl(new Date(usuarioForm?.dataNascimento).toISOString().split('T')[0], [Validators.required]),
      'escolaridade': new FormControl(usuarioForm?.escolaridade, Validators.required)
    })
  }
  
  criarUsuario() {
    if(!this.validarDataDeNascimento()){
      return;
    }
    this.usuario = 
    {
      id : 0,
      nome: this.formularioUsuario.get('nome')?.value.toString(),
      sobrenome: this.formularioUsuario.get('sobrenome')?.value.toString(),
      email: this.formularioUsuario.get('email')?.value.toString(),
      dataNascimento: this.formularioUsuario.get('dataNascimento')?.value.toString(),
      escolaridade: Number(this.formularioUsuario.get('escolaridade')?.value)
    }

    this.usuarioService.AdicionarUsuario(this.usuario).subscribe(()=>{
      this.modalRef?.hide();
      this.toastr.success("Usuario criado","Sucesso");
      this.buscarTodosUsuarios();
    })
  }

  atualizarUsuario(){
    if(!this.validarDataDeNascimento()){
      return;
    }
    this.usuario = 
    {
      id : Number(this.formularioUsuario.get('id')?.value),
      nome: this.formularioUsuario.get('nome')?.value.toString(),
      sobrenome: this.formularioUsuario.get('sobrenome')?.value.toString(),
      email: this.formularioUsuario.get('email')?.value.toString(),
      dataNascimento: this.formularioUsuario.get('dataNascimento')?.value.toString(),
      escolaridade: Number(this.formularioUsuario.get('escolaridade')?.value)
    }
    this.usuarioService.AtualizarUsuario(this.usuario).subscribe(()=>{
      this.modalRef?.hide();
      this.toastr.success("Usuario atualizado","Sucesso");
      this.buscarTodosUsuarios();
    })
  }

  validarDataDeNascimento() {
    let dataNasc = new Date(this.formularioUsuario.get('dataNascimento')?.value);
    let today = new Date()
    if (dataNasc > today) {
      this.toastr.warning("Data de nascimento não pode ser maior que hoje.", "Aviso")
      return false;
    }
    return true;
  }
}
