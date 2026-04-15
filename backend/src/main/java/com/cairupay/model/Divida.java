package com.cairupay.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Divida")
public class Divida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer codigo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "credor_id", nullable = false)
    private Pessoa credor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "devedor_id", nullable = false)
    private Pessoa devedor;

    @Column(name = "dataAtualizacao", nullable = false)
    private LocalDate dataAtualizacao;

    @Column(name = "valorDivida", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorDivida;

    public Divida() {}

    // Getters e Setters
    public Integer getCodigo() { return codigo; }
    public void setCodigo(Integer codigo) { this.codigo = codigo; }

    public Pessoa getCredor() { return credor; }
    public void setCredor(Pessoa credor) { this.credor = credor; }

    public Pessoa getDevedor() { return devedor; }
    public void setDevedor(Pessoa devedor) { this.devedor = devedor; }

    public LocalDate getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDate dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }

    public BigDecimal getValorDivida() { return valorDivida; }
    public void setValorDivida(BigDecimal valorDivida) { this.valorDivida = valorDivida; }
}
