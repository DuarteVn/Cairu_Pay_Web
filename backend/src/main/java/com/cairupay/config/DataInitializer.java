package com.cairupay.config;

import com.cairupay.model.Usuario;
import com.cairupay.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Inicializa o usuário admin padrão caso não exista no banco.
 * Usa o PasswordEncoder do Spring (BCrypt) para gerar o hash da senha.
 */
@Component
@Order(1)
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByLogin("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setCargo("ADMIN");
            admin.setLogin("admin");
            admin.setSenha(passwordEncoder.encode("admin"));
            admin.setEmail("admin@cairupay.com");
            usuarioRepository.save(admin);
            System.out.println("✅ Usuário admin criado com sucesso! (login: admin / senha: admin)");
        } else {
            // Atualizar a senha do admin existente para garantir que funciona
            Usuario admin = usuarioRepository.findByLogin("admin").get();
            admin.setSenha(passwordEncoder.encode("admin"));
            usuarioRepository.save(admin);
            System.out.println("✅ Senha do admin atualizada! (login: admin / senha: admin)");
        }
    }
}
