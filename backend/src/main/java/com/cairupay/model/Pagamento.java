package com.cairupay.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "Pagamento")
public class Pagamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idpag")
    private Integer idpag;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "divida_codigo", nullable = false)
    private Divida divida;

    @Column(name = "dataPagamento", nullable = false)
    private LocalDate dataPagamento;

    @Column(name = "valorPago", nullable = false, precision = 15, scale = 2)
    private BigDecimal valorPago;

    public Pagamento() {}

    // Getters e Setters
    public Integer getIdpag() { return idpag; }
    public void setIdpag(Integer idpag) { this.idpag = idpag; }

    public Divida getDivida() { return divida; }
    public void setDivida(Divida divida) { this.divida = divida; }

    public LocalDate getDataPagamento() { return dataPagamento; }
    public void setDataPagamento(LocalDate dataPagamento) { this.dataPagamento = dataPagamento; }

    public BigDecimal getValorPago() { return valorPago; }
    public void setValorPago(BigDecimal valorPago) { this.valorPago = valorPago; }
}
