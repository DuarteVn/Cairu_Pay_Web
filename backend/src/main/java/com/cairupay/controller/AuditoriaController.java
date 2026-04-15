package com.cairupay.controller;

import com.cairupay.model.LogAuditoriaDetalhado;
import com.cairupay.repository.LogAuditoriaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
public class AuditoriaController {

    private final LogAuditoriaRepository logAuditoriaRepository;

    public AuditoriaController(LogAuditoriaRepository logAuditoriaRepository) {
        this.logAuditoriaRepository = logAuditoriaRepository;
    }

    @GetMapping
    public List<LogAuditoriaDetalhado> listarTodos() {
        return logAuditoriaRepository.findAllByOrderByDataHoraDesc();
    }

    @GetMapping("/{tabela}/{id}")
    public List<LogAuditoriaDetalhado> buscarPorRegistro(
            @PathVariable String tabela,
            @PathVariable Integer id) {
        return logAuditoriaRepository.findByTabelaAfetadaAndIdRegistroOrderByDataHoraDesc(tabela, id);
    }
}
