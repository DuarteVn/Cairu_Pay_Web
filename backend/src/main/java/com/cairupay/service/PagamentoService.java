package com.cairupay.service;

import com.cairupay.dto.PagamentoCreateRequest;
import com.cairupay.dto.ReceitaDiariaDTO;
import com.cairupay.model.Divida;
import com.cairupay.model.Pagamento;
import com.cairupay.repository.DividaRepository;
import com.cairupay.repository.PagamentoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PagamentoService {

    private static final BigDecimal MULTA = new BigDecimal("0.02");
    private static final BigDecimal JUROS_DIA = new BigDecimal("0.0035");

    private final PagamentoRepository pagamentoRepository;
    private final DividaRepository dividaRepository;
    private final AuditoriaService auditoriaService;

    public PagamentoService(PagamentoRepository pagamentoRepository, DividaRepository dividaRepository, AuditoriaService auditoriaService) {
        this.pagamentoRepository = pagamentoRepository;
        this.dividaRepository = dividaRepository;
        this.auditoriaService = auditoriaService;
    }

    public List<Pagamento> listarTodos() {
        return pagamentoRepository.findAll();
    }

    @Transactional
    public Pagamento criar(PagamentoCreateRequest request) {
        Divida divida = dividaRepository.findById(request.getDividaCodigo())
                .orElseThrow(() -> new RuntimeException("Dívida não encontrada"));

        BigDecimal valorPagoAcumulado = Objects.requireNonNullElse(
                pagamentoRepository.sumValorPagoByDividaCodigo(divida.getCodigo()), BigDecimal.ZERO);
        if (valorPagoAcumulado.compareTo(divida.getValorDivida()) >= 0) {
            throw new RuntimeException("Dívida já está paga");
        }

        LocalDate dataPagamento = request.getDataPagamento();
        if (dataPagamento.isAfter(divida.getDataAtualizacao())) {
            long dias = ChronoUnit.DAYS.between(divida.getDataAtualizacao(), dataPagamento);
            BigDecimal valorBase = divida.getValorDivida();
            BigDecimal multa = valorBase.multiply(MULTA);
            BigDecimal juros = valorBase.multiply(JUROS_DIA).multiply(BigDecimal.valueOf(dias));
            BigDecimal valorCorrigido = valorBase.add(multa).add(juros).setScale(2, RoundingMode.HALF_UP);

            auditoriaService.registrar("Divida", divida.getCodigo(), "UPDATE", "valorDivida",
                    valorBase.toString(), valorCorrigido.toString());
            divida.setValorDivida(valorCorrigido);
            divida.setDataAtualizacao(dataPagamento);
            dividaRepository.save(divida);
        }

        if (request.getValorPago().compareTo(divida.getValorDivida()) < 0) {
            throw new RuntimeException(
                "Valor pago R$ " + request.getValorPago() +
                " inferior ao valor da dívida R$ " + divida.getValorDivida()
            );
        }

        Pagamento pagamento = new Pagamento();
        pagamento.setDivida(divida);
        pagamento.setDataPagamento(dataPagamento);
        pagamento.setValorPago(request.getValorPago());

        Pagamento salvo = pagamentoRepository.save(pagamento);
        auditoriaService.registrar("Pagamento", salvo.getIdpag(), "INSERT", "TODOS", null,
                "Valor: " + salvo.getValorPago() + " | Data: " + salvo.getDataPagamento());
        return salvo;
    }

    @Transactional
    public void deletar(Integer id) {
        pagamentoRepository.deleteById(id);
    }

    public List<ReceitaDiariaDTO> receitaPorPeriodo(LocalDate inicio, LocalDate fim) {
        List<Pagamento> pagamentos = pagamentoRepository.findByPeriodo(inicio, fim);

        Map<LocalDate, List<Pagamento>> agrupado = pagamentos.stream()
                .collect(Collectors.groupingBy(Pagamento::getDataPagamento, TreeMap::new, Collectors.toList()));

        List<ReceitaDiariaDTO> resultado = new ArrayList<>();

        LocalDate current = inicio;
        while (!current.isAfter(fim)) {
            List<Pagamento> doDia = agrupado.getOrDefault(current, Collections.emptyList());
            BigDecimal totalDia = doDia.stream()
                    .map(Pagamento::getValorPago)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            resultado.add(new ReceitaDiariaDTO(current, totalDia, doDia.size()));
            current = current.plusDays(1);
        }

        return resultado;
    }
}
