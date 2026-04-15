package com.cairupay.repository;

import com.cairupay.model.LogAuditoriaDetalhado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LogAuditoriaRepository extends JpaRepository<LogAuditoriaDetalhado, Integer> {

    List<LogAuditoriaDetalhado> findByTabelaAfetadaAndIdRegistroOrderByDataHoraDesc(String tabelaAfetada, Integer idRegistro);

    List<LogAuditoriaDetalhado> findAllByOrderByDataHoraDesc();
}
