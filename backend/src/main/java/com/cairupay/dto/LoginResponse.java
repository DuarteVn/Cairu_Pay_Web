package com.cairupay.dto;

public class LoginResponse {
    private String nome;
    private String cargo;
    private String login;
    private String email;

    public LoginResponse(String nome, String cargo, String login, String email) {
        this.nome = nome;
        this.cargo = cargo;
        this.login = login;
        this.email = email;
    }

    public String getNome() { return nome; }
    public String getCargo() { return cargo; }
    public String getLogin() { return login; }
    public String getEmail() { return email; }
}
