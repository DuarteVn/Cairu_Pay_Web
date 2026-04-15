package com.cairupay.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Pessoa")
public class Pessoa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idPessoa;

    @Column(name = "nomeCliente", nullable = false, length = 100)
    private String nomeCliente;

    @Column(length = 255)
    private String endereco;

    @Column(length = 2)
    private String uf;

    @Column(length = 20)
    private String telefone;

    @Column(nullable = false, unique = true, length = 20)
    private String documento;

    @Column(length = 100)
    private String email;

    public Pessoa() {}

    // Getters e Setters
    public Integer getIdPessoa() { return idPessoa; }
    public void setIdPessoa(Integer idPessoa) { this.idPessoa = idPessoa; }

    public String getNomeCliente() { return nomeCliente; }
    public void setNomeCliente(String nomeCliente) { this.nomeCliente = nomeCliente; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getUf() { return uf; }
    public void setUf(String uf) { this.uf = uf; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getDocumento() { return documento; }
    public void setDocumento(String documento) { this.documento = documento; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
