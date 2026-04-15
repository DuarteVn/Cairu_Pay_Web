package com.cairupay.repository;

import com.cairupay.model.Pagamento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PagamentoRepository extends JpaRepository<Pagamento, Integer> {

    List<Pagamento> findByDividaCodigo(Integer dividaCodigo);

    @Query("SELECT COALESCE(SUM(p.valorPago), 0) FROM Pagamento p WHERE p.divida.codigo = :dividaCodigo")
    BigDecimal sumValorPagoByDividaCodigo(@Param("dividaCodigo") Integer dividaCodigo);

    @Query("SELECT p FROM Pagamento p WHERE p.dataPagamento BETWEEN :inicio AND :fim ORDER BY p.dataPagamento")
    List<Pagamento> findByPeriodo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);
}
