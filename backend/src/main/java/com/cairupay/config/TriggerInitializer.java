package com.cairupay.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

/**
 * Executa o script de triggers na inicialização da aplicação.
 * As triggers não podem ser criadas via JPA/Hibernate, então usamos
 * execução direta de SQL na startup.
 */
@Component
public class TriggerInitializer implements CommandLineRunner {

    private final DataSource dataSource;

    public TriggerInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) {
        try {
            ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
            populator.addScript(new ClassPathResource("triggers.sql"));
            populator.setSeparator(";\n");
            populator.setContinueOnError(true);
            populator.execute(dataSource);
            System.out.println("✅ Triggers de auditoria criadas com sucesso!");
        } catch (Exception e) {
            System.out.println("⚠️ Aviso ao criar triggers (pode ser que já existam): " + e.getMessage());
        }
    }
}
