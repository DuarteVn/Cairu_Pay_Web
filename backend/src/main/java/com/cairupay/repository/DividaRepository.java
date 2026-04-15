package com.cairupay.repository;

import com.cairupay.model.Divida;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DividaRepository extends JpaRepository<Divida, Integer> {

    @Query("SELECT d FROM Divida d WHERE d.credor.documento = :documento OR d.devedor.documento = :documento")
    List<Divida> findByDocumento(@Param("documento") String documento);
}
