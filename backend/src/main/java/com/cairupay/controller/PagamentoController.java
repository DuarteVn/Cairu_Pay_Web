package com.cairupay.controller;

import com.cairupay.dto.PagamentoCreateRequest;
import com.cairupay.dto.ReceitaDiariaDTO;
import com.cairupay.model.Pagamento;
import com.cairupay.service.PagamentoService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/pagamentos")
public class PagamentoController {

    private final PagamentoService pagamentoService;

    public PagamentoController(PagamentoService pagamentoService) {
        this.pagamentoService = pagamentoService;
    }

    @GetMapping
    public List<Pagamento> listar() {
        return pagamentoService.listarTodos();
    }

    @PostMapping
    public Pagamento criar(@RequestBody PagamentoCreateRequest request) {
        return pagamentoService.criar(request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        pagamentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/receita")
    public List<ReceitaDiariaDTO> receitaPorPeriodo(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return pagamentoService.receitaPorPeriodo(inicio, fim);
    }
}
