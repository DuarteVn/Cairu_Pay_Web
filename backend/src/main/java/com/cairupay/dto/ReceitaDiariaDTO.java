package com.cairupay.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class ReceitaDiariaDTO {
    private LocalDate data;
    private BigDecimal valor;
    private int pagamentos;

    public ReceitaDiariaDTO(LocalDate data, BigDecimal valor, int pagamentos) {
        this.data = data;
        this.valor = valor;
        this.pagamentos = pagamentos;
    }

    public LocalDate getData() { return data; }
    public BigDecimal getValor() { return valor; }
    public int getPagamentos() { return pagamentos; }
}
