package com.cairupay.dto;

import java.math.BigDecimal;

public class DividaCreateRequest {
    private Integer credorId;
    private Integer devedorId;
    private BigDecimal valorDivida;

    public Integer getCredorId() { return credorId; }
    public void setCredorId(Integer credorId) { this.credorId = credorId; }

    public Integer getDevedorId() { return devedorId; }
    public void setDevedorId(Integer devedorId) { this.devedorId = devedorId; }

    public BigDecimal getValorDivida() { return valorDivida; }
    public void setValorDivida(BigDecimal valorDivida) { this.valorDivida = valorDivida; }
}
