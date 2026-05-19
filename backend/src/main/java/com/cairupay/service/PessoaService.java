package com.cairupay.service;

import com.cairupay.model.Pessoa;
import com.cairupay.repository.DividaRepository;
import com.cairupay.repository.PessoaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class PessoaService {

    private final PessoaRepository pessoaRepository;
    private final DividaRepository dividaRepository;
    private final AuditoriaService auditoriaService;

    public PessoaService(PessoaRepository pessoaRepository, DividaRepository dividaRepository, AuditoriaService auditoriaService) {
        this.pessoaRepository = pessoaRepository;
        this.dividaRepository = dividaRepository;
        this.auditoriaService = auditoriaService;
    }

    public List<Pessoa> listarTodas() {
        return pessoaRepository.findAll();
    }

    public Optional<Pessoa> buscarPorId(Integer id) {
        return pessoaRepository.findById(id);
    }

    @Transactional
    public Pessoa salvar(Pessoa pessoa) {
        if (pessoa.getIdPessoa() != null) {
            pessoaRepository.findById(pessoa.getIdPessoa()).ifPresent(antigo -> {
                if (!Objects.equals(antigo.getNomeCliente(), pessoa.getNomeCliente())) {
                    auditoriaService.registrar("Pessoa", pessoa.getIdPessoa(), "UPDATE",
                            "nomeCliente", antigo.getNomeCliente(), pessoa.getNomeCliente());
                }
                if (!Objects.equals(antigo.getTelefone(), pessoa.getTelefone())) {
                    auditoriaService.registrar("Pessoa", pessoa.getIdPessoa(), "UPDATE",
                            "telefone", antigo.getTelefone(), pessoa.getTelefone());
                }
            });
        }
        return pessoaRepository.save(pessoa);
    }

    @Transactional
    public void deletar(Integer id) {
        if (dividaRepository.existsByCredorIdPessoaOrDevedorIdPessoa(id, id)) {
            throw new RuntimeException("Pessoa possui dívidas associadas e não pode ser excluída");
        }
        pessoaRepository.deleteById(id);
    }
}
