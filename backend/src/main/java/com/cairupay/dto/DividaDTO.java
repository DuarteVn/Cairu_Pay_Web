package com.cairupay.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DividaDTO {
    private Integer codigo;
    private Integer credorId;
    private String credorNome;
    private String credorDocumento;
    private Integer devedorId;
    private String devedorNome;
    private String devedorDocumento;
    private LocalDate dataAtualizacao;
    private BigDecimal valorDivida;
    private BigDecimal valorPago;
    private BigDecimal valorRestante;
    private String status; // "pendente", "paga", "vencida"

    // Getters e Setters
    public Integer getCodigo() { return codigo; }
    public void setCodigo(Integer codigo) { this.codigo = codigo; }

    public Integer getCredorId() { return credorId; }
    public void setCredorId(Integer credorId) { this.credorId = credorId; }

    public String getCredorNome() { return credorNome; }
    public void setCredorNome(String credorNome) { this.credorNome = credorNome; }

    public String getCredorDocumento() { return credorDocumento; }
    public void setCredorDocumento(String credorDocumento) { this.credorDocumento = credorDocumento; }

    public Integer getDevedorId() { return devedorId; }
    public void setDevedorId(Integer devedorId) { this.devedorId = devedorId; }

    public String getDevedorNome() { return devedorNome; }
    public void setDevedorNome(String devedorNome) { this.devedorNome = devedorNome; }

    public String getDevedorDocumento() { return devedorDocumento; }
    public void setDevedorDocumento(String devedorDocumento) { this.devedorDocumento = devedorDocumento; }

    public LocalDate getDataAtualizacao() { return dataAtualizacao; }
    public void setDataAtualizacao(LocalDate dataAtualizacao) { this.dataAtualizacao = dataAtualizacao; }

    public BigDecimal getValorDivida() { return valorDivida; }
    public void setValorDivida(BigDecimal valorDivida) { this.valorDivida = valorDivida; }

    public BigDecimal getValorPago() { return valorPago; }
    public void setValorPago(BigDecimal valorPago) { this.valorPago = valorPago; }

    public BigDecimal getValorRestante() { return valorRestante; }
    public void setValorRestante(BigDecimal valorRestante) { this.valorRestante = valorRestante; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
