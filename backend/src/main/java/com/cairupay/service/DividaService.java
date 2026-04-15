package com.cairupay.service;

import com.cairupay.dto.DividaDTO;
import com.cairupay.dto.DividaCreateRequest;
import com.cairupay.model.Divida;
import com.cairupay.model.Pessoa;
import com.cairupay.repository.DividaRepository;
import com.cairupay.repository.PagamentoRepository;
import com.cairupay.repository.PessoaRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DividaService {

    private final DividaRepository dividaRepository;
    private final PessoaRepository pessoaRepository;
    private final PagamentoRepository pagamentoRepository;

    public DividaService(DividaRepository dividaRepository, PessoaRepository pessoaRepository, PagamentoRepository pagamentoRepository) {
        this.dividaRepository = dividaRepository;
        this.pessoaRepository = pessoaRepository;
        this.pagamentoRepository = pagamentoRepository;
    }

    public List<DividaDTO> listarTodas() {
        return dividaRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<DividaDTO> buscarPorCodigo(Integer codigo) {
        return dividaRepository.findById(codigo).map(this::toDTO);
    }

    public List<DividaDTO> listarAbertas() {
        return dividaRepository.findAll().stream()
                .map(this::toDTO)
                .filter(dto -> !"paga".equals(dto.getStatus()))
                .collect(Collectors.toList());
    }

    public List<DividaDTO> buscarPorDocumento(String documento) {
        return dividaRepository.findByDocumento(documento).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Divida criar(DividaCreateRequest request) {
        Pessoa credor = pessoaRepository.findById(request.getCredorId())
                .orElseThrow(() -> new RuntimeException("Credor não encontrado"));
        Pessoa devedor = pessoaRepository.findById(request.getDevedorId())
                .orElseThrow(() -> new RuntimeException("Devedor não encontrado"));

        Divida divida = new Divida();
        divida.setCredor(credor);
        divida.setDevedor(devedor);
        divida.setValorDivida(request.getValorDivida());
        divida.setDataAtualizacao(LocalDate.now());

        return dividaRepository.save(divida);
    }

    public Divida atualizar(Integer codigo, DividaCreateRequest request) {
        Divida divida = dividaRepository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Dívida não encontrada"));

        if (request.getCredorId() != null) {
            Pessoa credor = pessoaRepository.findById(request.getCredorId())
                    .orElseThrow(() -> new RuntimeException("Credor não encontrado"));
            divida.setCredor(credor);
        }
        if (request.getDevedorId() != null) {
            Pessoa devedor = pessoaRepository.findById(request.getDevedorId())
                    .orElseThrow(() -> new RuntimeException("Devedor não encontrado"));
            divida.setDevedor(devedor);
        }
        if (request.getValorDivida() != null) {
            divida.setValorDivida(request.getValorDivida());
        }
        divida.setDataAtualizacao(LocalDate.now());

        return dividaRepository.save(divida);
    }

    public void deletar(Integer codigo) {
        dividaRepository.deleteById(codigo);
    }

    private DividaDTO toDTO(Divida divida) {
        DividaDTO dto = new DividaDTO();
        dto.setCodigo(divida.getCodigo());
        dto.setCredorId(divida.getCredor().getIdPessoa());
        dto.setCredorNome(divida.getCredor().getNomeCliente());
        dto.setCredorDocumento(divida.getCredor().getDocumento());
        dto.setDevedorId(divida.getDevedor().getIdPessoa());
        dto.setDevedorNome(divida.getDevedor().getNomeCliente());
        dto.setDevedorDocumento(divida.getDevedor().getDocumento());
        dto.setDataAtualizacao(divida.getDataAtualizacao());
        dto.setValorDivida(divida.getValorDivida());

        BigDecimal valorPago = pagamentoRepository.sumValorPagoByDividaCodigo(divida.getCodigo());
        dto.setValorPago(valorPago);
        dto.setValorRestante(divida.getValorDivida().subtract(valorPago));

        // Calcular status
        if (valorPago.compareTo(divida.getValorDivida()) >= 0) {
            dto.setStatus("paga");
        } else {
            dto.setStatus("pendente");
        }

        return dto;
    }
}
