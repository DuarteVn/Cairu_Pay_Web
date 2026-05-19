package com.cairupay.service;

import com.cairupay.model.LogAuditoriaDetalhado;
import com.cairupay.repository.LogAuditoriaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuditoriaService {

    private final LogAuditoriaRepository logRepository;

    public AuditoriaService(LogAuditoriaRepository logRepository) {
        this.logRepository = logRepository;
    }

    public void registrar(String tabela, Integer idRegistro, String acao, String campo, String valorAntigo, String valorNovo) {
        LogAuditoriaDetalhado log = new LogAuditoriaDetalhado();
        log.setTabelaAfetada(tabela);
        log.setIdRegistro(idRegistro);
        log.setAcao(acao);
        log.setCampoAlterado(campo);
        log.setValorAntigo(valorAntigo);
        log.setValorNovo(valorNovo);
        log.setDataHora(LocalDateTime.now());
        log.setUsuarioDb("application");
        logRepository.save(log);
    }
}
