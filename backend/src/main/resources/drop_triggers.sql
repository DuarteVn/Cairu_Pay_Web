-- Rodar no DBeaver antes de fazer deploy da nova versão
-- Remove triggers do banco (auditoria migrada para camada Java)
DROP TRIGGER IF EXISTS tr_log_pessoa_detalhado;
DROP TRIGGER IF EXISTS tr_log_divida_valor;
DROP TRIGGER IF EXISTS tr_log_pagamento_detalhado;
