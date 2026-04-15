package com.cairupay.controller;

import com.cairupay.dto.LoginRequest;
import com.cairupay.dto.LoginResponse;
import com.cairupay.model.Usuario;
import com.cairupay.service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        boolean valido = usuarioService.autenticar(request.getLogin(), request.getSenha());

        if (!valido) {
            return ResponseEntity.status(401).body("Usuário ou senha incorretos");
        }

        Usuario usuario = usuarioService.findByLogin(request.getLogin()).orElseThrow();
        LoginResponse response = new LoginResponse(
                usuario.getNome(),
                usuario.getCargo(),
                usuario.getLogin(),
                usuario.getEmail()
        );

        return ResponseEntity.ok(response);
    }
}
