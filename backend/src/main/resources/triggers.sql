-- ============================================
-- CairuPay - Schema + Triggers de Auditoria
-- ============================================

-- Tabela de auditoria
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

-- TRIGGER PARA PESSOA (ALTERAÇÃO)
DROP TRIGGER IF EXISTS tr_log_pessoa_detalhado;

CREATE TRIGGER tr_log_pessoa_detalhado
AFTER UPDATE ON Pessoa
FOR EACH ROW
BEGIN
    IF (OLD.nomeCliente <> NEW.nomeCliente) THEN
        INSERT INTO Log_Auditoria_Detalhado (tabela_afetada, id_registro, acao, campo_alterado, valor_antigo, valor_novo, usuario_id, usuario_db)
        VALUES ('Pessoa', OLD.idPessoa, 'UPDATE', 'nomeCliente', OLD.nomeCliente, NEW.nomeCliente, @usuario_logado_id, USER());
    END IF;
    
    IF (OLD.telefone <> NEW.telefone) THEN
        INSERT INTO Log_Auditoria_Detalhado (tabela_afetada, id_registro, acao, campo_alterado, valor_antigo, valor_novo, usuario_id, usuario_db)
        VALUES ('Pessoa', OLD.idPessoa, 'UPDATE', 'telefone', OLD.telefone, NEW.telefone, @usuario_logado_id, USER());
    END IF;
END;

-- TRIGGER PARA DIVIDA (ALTERAÇÃO DE VALOR)
DROP TRIGGER IF EXISTS tr_log_divida_valor;

CREATE TRIGGER tr_log_divida_valor
AFTER UPDATE ON Divida
FOR EACH ROW
BEGIN
    IF (OLD.valorDivida <> NEW.valorDivida) THEN
        INSERT INTO Log_Auditoria_Detalhado (tabela_afetada, id_registro, acao, campo_alterado, valor_antigo, valor_novo, usuario_id, usuario_db)
        VALUES ('Divida', OLD.codigo, 'UPDATE', 'valorDivida', OLD.valorDivida, NEW.valorDivida, @usuario_logado_id, USER());
    END IF;
END;

-- TRIGGER PARA PAGAMENTO (REGISTRO DE NOVO PAGAMENTO)
DROP TRIGGER IF EXISTS tr_log_pagamento_detalhado;

CREATE TRIGGER tr_log_pagamento_detalhado
AFTER INSERT ON Pagamento
FOR EACH ROW
BEGIN
    INSERT INTO Log_Auditoria_Detalhado (tabela_afetada, id_registro, acao, campo_alterado, valor_antigo, valor_novo, usuario_id, usuario_db)
    VALUES ('Pagamento', NEW.idpag, 'INSERT', 'TODOS', NULL, 
            CONCAT('Valor: ', NEW.valorPago, ' | Data: ', NEW.dataPagamento), @usuario_logado_id, USER());
END;
