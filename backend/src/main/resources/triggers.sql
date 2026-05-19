-- Tabela de auditoria (auditoria gerenciada pela camada Java)
CREATE TABLE IF NOT EXISTS Log_Auditoria_Detalhado (
    idLog INT AUTO_INCREMENT PRIMARY KEY,
    tabela_afetada VARCHAR(50),
    id_registro INT,
    acao VARCHAR(20),
    campo_alterado VARCHAR(50),
    valor_antigo TEXT,
    valor_novo TEXT,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    usuario_id INT,
    usuario_db VARCHAR(50)
);
