package com.cairupay.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Log_Auditoria_Detalhado")
public class LogAuditoriaDetalhado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idLog;

    @Column(name = "tabela_afetada", length = 50)
    private String tabelaAfetada;

    @Column(name = "id_registro")
    private Integer idRegistro;

    @Column(length = 20)
    private String acao;

    @Column(name = "campo_alterado", length = 50)
    private String campoAlterado;

    @Column(name = "valor_antigo", columnDefinition = "TEXT")
    private String valorAntigo;

    @Column(name = "valor_novo", columnDefinition = "TEXT")
    private String valorNovo;

    @Column(name = "data_hora")
    private LocalDateTime dataHora;

    @Column(name = "usuario_id")
    private Integer usuarioId;

    @Column(name = "usuario_db", length = 50)
    private String usuarioDb;

    public LogAuditoriaDetalhado() {}

    // Getters e Setters
    public Integer getIdLog() { return idLog; }
    public void setIdLog(Integer idLog) { this.idLog = idLog; }

    public String getTabelaAfetada() { return tabelaAfetada; }
    public void setTabelaAfetada(String tabelaAfetada) { this.tabelaAfetada = tabelaAfetada; }

    public Integer getIdRegistro() { return idRegistro; }
    public void setIdRegistro(Integer idRegistro) { this.idRegistro = idRegistro; }

    public String getAcao() { return acao; }
    public void setAcao(String acao) { this.acao = acao; }

    public String getCampoAlterado() { return campoAlterado; }
    public void setCampoAlterado(String campoAlterado) { this.campoAlterado = campoAlterado; }

    public String getValorAntigo() { return valorAntigo; }
    public void setValorAntigo(String valorAntigo) { this.valorAntigo = valorAntigo; }

    public String getValorNovo() { return valorNovo; }
    public void setValorNovo(String valorNovo) { this.valorNovo = valorNovo; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public Integer getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Integer usuarioId) { this.usuarioId = usuarioId; }

    public String getUsuarioDb() { return usuarioDb; }
    public void setUsuarioDb(String usuarioDb) { this.usuarioDb = usuarioDb; }
}
