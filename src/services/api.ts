const API_BASE = 'http://localhost:8080/api';

// Utilitário para obter as credenciais de autenticação do localStorage
function getAuthHeaders(): HeadersInit {
  const creds = localStorage.getItem('cairupay-credentials');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (creds) {
    headers['Authorization'] = `Basic ${creds}`;
  }
  return headers;
}

// Tratamento centralizado de erros
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    localStorage.removeItem('cairupay-credentials');
    localStorage.removeItem('cairupay-usuario');
    window.location.reload();
    throw new Error('Sessão expirada');
  }
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Erro ${response.status}`);
  }
  return response.json();
}

// ==================== AUTH ====================

export interface LoginResponseData {
  nome: string;
  cargo: string;
  login: string;
  email: string;
}

export async function login(loginStr: string, senha: string): Promise<LoginResponseData> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login: loginStr, senha }),
  });

  if (!response.ok) {
    throw new Error('Usuário ou senha incorretos');
  }

  // Salvar credenciais Basic Auth para requests futuros
  const credentials = btoa(`${loginStr}:${senha}`);
  localStorage.setItem('cairupay-credentials', credentials);

  return response.json();
}

// ==================== PESSOAS ====================

export interface PessoaData {
  idPessoa?: number;
  nomeCliente: string;
  endereco: string;
  uf: string;
  telefone: string;
  documento: string;
  email: string;
}

export async function getPessoas(): Promise<PessoaData[]> {
  const response = await fetch(`${API_BASE}/pessoas`, { headers: getAuthHeaders() });
  return handleResponse<PessoaData[]>(response);
}

export async function createPessoa(pessoa: PessoaData): Promise<PessoaData> {
  const response = await fetch(`${API_BASE}/pessoas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(pessoa),
  });
  return handleResponse<PessoaData>(response);
}

export async function updatePessoa(id: number, pessoa: PessoaData): Promise<PessoaData> {
  const response = await fetch(`${API_BASE}/pessoas/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(pessoa),
  });
  return handleResponse<PessoaData>(response);
}

export async function deletePessoa(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/pessoas/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erro ao excluir pessoa');
}

// ==================== DÍVIDAS ====================

export interface DividaData {
  codigo: number;
  credorId: number;
  credorNome: string;
  credorDocumento: string;
  devedorId: number;
  devedorNome: string;
  devedorDocumento: string;
  dataAtualizacao: string;
  valorDivida: number;
  valorPago: number;
  valorRestante: number;
  status: string;
}

export interface DividaCreateData {
  credorId: number;
  devedorId: number;
  valorDivida: number;
}

export async function getDividas(): Promise<DividaData[]> {
  const response = await fetch(`${API_BASE}/dividas`, { headers: getAuthHeaders() });
  return handleResponse<DividaData[]>(response);
}

export async function getDividasAbertas(): Promise<DividaData[]> {
  const response = await fetch(`${API_BASE}/dividas/abertas`, { headers: getAuthHeaders() });
  return handleResponse<DividaData[]>(response);
}

export async function getDividasPorDocumento(doc: string): Promise<DividaData[]> {
  const response = await fetch(`${API_BASE}/dividas/por-documento?doc=${encodeURIComponent(doc)}`, { headers: getAuthHeaders() });
  return handleResponse<DividaData[]>(response);
}

export async function createDivida(divida: DividaCreateData): Promise<any> {
  const response = await fetch(`${API_BASE}/dividas`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(divida),
  });
  return handleResponse<any>(response);
}

export async function updateDivida(codigo: number, divida: DividaCreateData): Promise<any> {
  const response = await fetch(`${API_BASE}/dividas/${codigo}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(divida),
  });
  return handleResponse<any>(response);
}

export async function deleteDivida(codigo: number): Promise<void> {
  const response = await fetch(`${API_BASE}/dividas/${codigo}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erro ao excluir dívida');
}

// ==================== PAGAMENTOS ====================

export interface PagamentoData {
  idpag: number;
  divida: {
    codigo: number;
    credor: { nomeCliente: string };
    devedor: { nomeCliente: string };
    valorDivida: number;
  };
  dataPagamento: string;
  valorPago: number;
}

export interface PagamentoCreateData {
  dividaCodigo: number;
  dataPagamento: string;
  valorPago: number;
}

export async function getPagamentos(): Promise<PagamentoData[]> {
  const response = await fetch(`${API_BASE}/pagamentos`, { headers: getAuthHeaders() });
  return handleResponse<PagamentoData[]>(response);
}

export async function createPagamento(pagamento: PagamentoCreateData): Promise<any> {
  const response = await fetch(`${API_BASE}/pagamentos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(pagamento),
  });
  return handleResponse<any>(response);
}

export async function deletePagamento(id: number): Promise<void> {
  const response = await fetch(`${API_BASE}/pagamentos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Erro ao excluir pagamento');
}

// ==================== RELATÓRIOS ====================

export interface ReceitaDiariaData {
  data: string;
  valor: number;
  pagamentos: number;
}

export async function getReceitaPorPeriodo(inicio: string, fim: string): Promise<ReceitaDiariaData[]> {
  const response = await fetch(
    `${API_BASE}/pagamentos/receita?inicio=${inicio}&fim=${fim}`,
    { headers: getAuthHeaders() }
  );
  return handleResponse<ReceitaDiariaData[]>(response);
}

// ==================== AUDITORIA ====================

export interface LogAuditoriaData {
  idLog: number;
  tabelaAfetada: string;
  idRegistro: number;
  acao: string;
  campoAlterado: string;
  valorAntigo: string;
  valorNovo: string;
  dataHora: string;
  usuarioId: number;
  usuarioDb: string;
}

export async function getAuditoria(): Promise<LogAuditoriaData[]> {
  const response = await fetch(`${API_BASE}/auditoria`, { headers: getAuthHeaders() });
  return handleResponse<LogAuditoriaData[]>(response);
}
