package com.cairupay.service;

import com.cairupay.dto.DividaDTO;
import com.cairupay.dto.DividaCreateRequest;
import com.cairupay.model.Divida;
import com.cairupay.model.Pessoa;
import com.cairupay.repository.DividaRepository;
import com.cairupay.repository.PagamentoRepository;
import com.cairupay.repository.PessoaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DividaService {

    private final DividaRepository dividaRepository;
    private final PessoaRepository pessoaRepository;
    private final PagamentoRepository pagamentoRepository;
    private final AuditoriaService auditoriaService;

    public DividaService(DividaRepository dividaRepository, PessoaRepository pessoaRepository, PagamentoRepository pagamentoRepository, AuditoriaService auditoriaService) {
        this.dividaRepository = dividaRepository;
        this.pessoaRepository = pessoaRepository;
        this.pagamentoRepository = pagamentoRepository;
        this.auditoriaService = auditoriaService;
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

    @Transactional
    public Divida criar(DividaCreateRequest request) {
        Pessoa credor = pessoaRepository.findById(request.getCredorId())
                .orElseThrow(() -> new RuntimeException("Credor não encontrado"));
        Pessoa devedor = pessoaRepository.findById(request.getDevedorId())
                .orElseThrow(() -> new RuntimeException("Devedor não encontrado"));

        if (credor.getIdPessoa().equals(devedor.getIdPessoa())) {
            throw new RuntimeException("Credor e devedor não podem ser a mesma pessoa");
        }

        Divida divida = new Divida();
        divida.setCredor(credor);
        divida.setDevedor(devedor);
        divida.setValorDivida(request.getValorDivida());
        divida.setDataAtualizacao(LocalDate.now());

        return dividaRepository.save(divida);
    }

    @Transactional
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

        if (divida.getCredor().getIdPessoa().equals(divida.getDevedor().getIdPessoa())) {
            throw new RuntimeException("Credor e devedor não podem ser a mesma pessoa");
        }

        if (request.getValorDivida() != null) {
            if (divida.getValorDivida().compareTo(request.getValorDivida()) != 0) {
                auditoriaService.registrar("Divida", codigo, "UPDATE", "valorDivida",
                        divida.getValorDivida().toString(), request.getValorDivida().toString());
            }
            divida.setValorDivida(request.getValorDivida());
        }
        divida.setDataAtualizacao(LocalDate.now());

        return dividaRepository.save(divida);
    }

    @Transactional
    public void deletar(Integer codigo) {
        if (!pagamentoRepository.findByDividaCodigo(codigo).isEmpty()) {
            throw new RuntimeException("Dívida possui pagamentos registrados e não pode ser excluída");
        }
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

        BigDecimal valorPago = Objects.requireNonNullElse(
                pagamentoRepository.sumValorPagoByDividaCodigo(divida.getCodigo()), BigDecimal.ZERO);
        dto.setValorPago(valorPago);
        dto.setValorRestante(divida.getValorDivida().subtract(valorPago));

        if (valorPago.compareTo(divida.getValorDivida()) >= 0) {
            dto.setStatus("paga");
        } else {
            dto.setStatus("pendente");
        }

        return dto;
    }
}
