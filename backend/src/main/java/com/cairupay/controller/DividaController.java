package com.cairupay.controller;

import com.cairupay.dto.DividaCreateRequest;
import com.cairupay.dto.DividaDTO;
import com.cairupay.model.Divida;
import com.cairupay.service.DividaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dividas")
public class DividaController {

    private final DividaService dividaService;

    public DividaController(DividaService dividaService) {
        this.dividaService = dividaService;
    }

    @GetMapping
    public List<DividaDTO> listar() {
        return dividaService.listarTodas();
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<DividaDTO> buscar(@PathVariable Integer codigo) {
        return dividaService.buscarPorCodigo(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/abertas")
    public List<DividaDTO> listarAbertas() {
        return dividaService.listarAbertas();
    }

    @GetMapping("/por-documento")
    public List<DividaDTO> buscarPorDocumento(@RequestParam String doc) {
        return dividaService.buscarPorDocumento(doc);
    }

    @PostMapping
    public Divida criar(@RequestBody DividaCreateRequest request) {
        return dividaService.criar(request);
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<Divida> atualizar(@PathVariable Integer codigo, @RequestBody DividaCreateRequest request) {
        Divida atualizada = dividaService.atualizar(codigo, request);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> deletar(@PathVariable Integer codigo) {
        dividaService.deletar(codigo);
        return ResponseEntity.noContent().build();
    }
}
