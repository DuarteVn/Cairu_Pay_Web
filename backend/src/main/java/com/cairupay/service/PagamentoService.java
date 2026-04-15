package com.cairupay.service;

import com.cairupay.dto.PagamentoCreateRequest;
import com.cairupay.dto.ReceitaDiariaDTO;
import com.cairupay.model.Divida;
import com.cairupay.model.Pagamento;
import com.cairupay.repository.DividaRepository;
import com.cairupay.repository.PagamentoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PagamentoService {

    private final PagamentoRepository pagamentoRepository;
    private final DividaRepository dividaRepository;

    public PagamentoService(PagamentoRepository pagamentoRepository, DividaRepository dividaRepository) {
        this.pagamentoRepository = pagamentoRepository;
        this.dividaRepository = dividaRepository;
    }

    public List<Pagamento> listarTodos() {
        return pagamentoRepository.findAll();
    }

    public Pagamento criar(PagamentoCreateRequest request) {
        Divida divida = dividaRepository.findById(request.getDividaCodigo())
                .orElseThrow(() -> new RuntimeException("Dívida não encontrada"));

        Pagamento pagamento = new Pagamento();
        pagamento.setDivida(divida);
        pagamento.setDataPagamento(request.getDataPagamento());
        pagamento.setValorPago(request.getValorPago());

        return pagamentoRepository.save(pagamento);
    }

    public void deletar(Integer id) {
        pagamentoRepository.deleteById(id);
    }

    public List<ReceitaDiariaDTO> receitaPorPeriodo(LocalDate inicio, LocalDate fim) {
        List<Pagamento> pagamentos = pagamentoRepository.findByPeriodo(inicio, fim);

        // Agrupar por data
        Map<LocalDate, List<Pagamento>> agrupado = pagamentos.stream()
                .collect(Collectors.groupingBy(Pagamento::getDataPagamento, TreeMap::new, Collectors.toList()));

        List<ReceitaDiariaDTO> resultado = new ArrayList<>();

        // Preencher todos os dias do período
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
