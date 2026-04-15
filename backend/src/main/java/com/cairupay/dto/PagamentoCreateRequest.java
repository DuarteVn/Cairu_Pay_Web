package com.cairupay.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PagamentoCreateRequest {
    private Integer dividaCodigo;
    private LocalDate dataPagamento;
    private BigDecimal valorPago;

    public Integer getDividaCodigo() { return dividaCodigo; }
    public void setDividaCodigo(Integer dividaCodigo) { this.dividaCodigo = dividaCodigo; }

    public LocalDate getDataPagamento() { return dataPagamento; }
    public void setDataPagamento(LocalDate dataPagamento) { this.dataPagamento = dataPagamento; }

    public BigDecimal getValorPago() { return valorPago; }
    public void setValorPago(BigDecimal valorPago) { this.valorPago = valorPago; }
}
