// CONFIGURAÇÃO FIXA DO ALUNO
const CONFIG_ALUNO = {
  turma: "9B",
  numeroChamada: 5,
  apiUrl: "https://boletim-api.profbt.com.br"
};

// DADOS FICTÍCIOS LOCALMENTE GUARDADOS (BACKUP / PADRÃO)
const dadosBoletimLocal = [
  { disciplina: "Língua Portuguesa", tri1: 78, tri2: "8,2", tri3: 8.6, faltas: [2, 2, 1] },
  { disciplina: "Matemática", tri1: 55, tri2: "5,4", tri3: null, faltas: [3, 2, 2] },
  { disciplina: "Ciências", tri1: 84, tri2: 7.9, tri3: "8,3", faltas: [1, 1, 1] },
  { disciplina: "História", tri1: "7,1", tri2: 82, tri3: null, faltas: [1, 2, 1] },
  { disciplina: "Geografia", tri1: 69, tri2: "7,5", tri3: 7.8, faltas: [0, 1, 1] },
  { disciplina: "Língua Inglesa", tri1: 88, tri2: 8.4, tri3: null, faltas: [1, 0, 1] },
  { disciplina: "Arte", tri1: "9,2", tri2: 87, tri3: 9.0, faltas: [1, 1, 0] },
  { disciplina: "Educação Física", tri1: 96, tri2: "9,3", tri3: null, faltas: [0, 1, 0] },
  { disciplina: "Educação Digital", tri1: 91, tri2: 8.9, tri3: "9,4", faltas: [1, 1, 0] },
  { disciplina: "Educação Financeira", tri1: 76, tri2: "7,2", tri3: null, faltas: [1, 1, 1] },
  { disciplina: "Rec. Aprend. Matemática", tri1: 58, tri2: "5,9", tri3: 6.2, faltas: [2, 2, 1] },
  { disciplina: "Leitura Rec. Aprend. Lingua Portuguesa", tri1: 72, tri2: "7,6", tri3: null, faltas: [2, 1, 1] },
  { disciplina: "Pensamento Lógico", tri1: 49, tri2: 5.5, tri3: "5,8", faltas: [2, 2, 2] },
  { disciplina: "Literatura Arte e Movimento", tri1: "8,0", tri2: 84, tri3: null, faltas: [1, 1, 0] },
  { disciplina: "Práticas Experimentais", tri1: 64, tri2: "6,6", tri3: 7.0, faltas: [1, 1, 1] }
];

// Frequência geral fictícia demonstrativa (preservada da versão anterior)
const FREQUENCIA_DEMONSTRATIVA = 92;

// Variáveis de sessão (mantidas apenas em memória)
let pinSessao = null;
let dadosAtuais = [];

// Função para normalizar qualquer valor de nota antigo para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  let numero = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : Number(valor);

  if (isNaN(numero) || numero < 0) {
    return null;
  }

  if (numero > 10 && numero <= 100) {
    numero = numero / 10;
  }

  if (numero > 10) {
    return null;
  }

  return numero;
}

// Formatação para exibição no HTML
function formatarNotaExibicao(notaNormalizada) {
  if (notaNormalizada === null || notaNormalizada === undefined) {
    return "—";
  }
  return Number(notaNormalizada).toFixed(1).replace(".", ",");
}

// Renderizar Tabela e Cards a partir dos dados atuais
function renderizarBoletim() {
  const tabelaCorpo = document.getElementById("tabela-boletim");
  tabelaCorpo.innerHTML = "";

  let somaMediasGerais = 0;
  let quantDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let totalBomDesempenho = 0;
  let totalAtencao = 0;

  dadosAtuais.forEach(item => {
    // Trata notas vindas de dados locais ou vindas da API
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    const notasValidas = [n1, n2, n3].filter(n => n !== null);
    let media = null;
    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      media = soma / notasValidas.length;
    }

    // Processa faltas de forma segura
    let faltasArray = [0, 0, 0];
    if (Array.isArray(item.faltas)) {
      faltasArray = item.faltas.map(f => Number(f) || 0);
    }
    const totalFaltasItem = faltasArray.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasItem;

    let situacao = "Nota ainda não disponível";
    let classeCss = "status-indisponivel";

    if (media !== null) {
      somaMediasGerais += media;
      quantDisciplinasComMedia++;

      if (media >= 6.0) {
        situacao = "Bom desempenho";
        classeCss = "status-bom";
        totalBomDesempenho++;
      } else {
        situacao = "Atenção";
        classeCss = "status-atencao";
        totalAtencao++;
      }
    }

    // Criação da linha com prevenção de inserção direta insegura de texto
    const tr = document.createElement("tr");

    const tdNome = document.createElement("td");
    const strongNome = document.createElement("strong");
    strongNome.textContent = item.disciplina;
    tdNome.appendChild(strongNome);

    const td1 = document.createElement("td");
    td1.textContent = formatarNotaExibicao(n1);

    const td2 = document.createElement("td");
    td2.textContent = formatarNotaExibicao(n2);

    const td3 = document.createElement("td");
    td3.textContent = formatarNotaExibicao(n3);

    const tdMedia = document.createElement("td");
    const strongMedia = document.createElement("strong");
    strongMedia.textContent = formatarNotaExibicao(media);
    tdMedia.appendChild(strongMedia);

    const tdFaltas = document.createElement("td");
    tdFaltas.textContent = totalFaltasItem;

    const tdSit = document.createElement("td");
    tdSit.textContent = situacao;
    tdSit.className = classeCss;

    tr.appendChild(tdNome);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(tdMedia);
    tr.appendChild(tdFaltas);
    tr.appendChild(tdSit);

    tabelaCorpo.appendChild(tr);
  });

  const mediaGeralFinal = quantDisciplinasComMedia > 0 
    ? (somaMediasGerais / quantDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("card-media-geral").textContent = mediaGeralFinal;
  document.getElementById("card-total-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = totalBomDesempenho;
  document.getElementById("card-atencao").textContent = totalAtencao;
}

// Abrir boletim via API
async function entrarBoletim() {
  const inputPin = document.getElementById("input-pin");
  const msgAcesso = document.getElementById("mensagem-acesso");
  const pinDigitado = inputPin.value.trim();

  if (!pinDigitado) {
    msgAcesso.textContent = "Por favor, digite seu PIN.";
    msgAcesso.className = "mensagem-status mensagem-erro";
    return;
  }

  msgAcesso.textContent = "Conectando...";
  msgAcesso.className = "mensagem-status mensagem-info";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/abrir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinDigitado
      })
    });

    if (resposta.status === 401) {
      msgAcesso.textContent = "Turma, chamada ou PIN inválidos.";
      msgAcesso.className = "mensagem-status mensagem-erro";
      return;
    }

    if (resposta.status === 429) {
      msgAcesso.textContent = "Muitas tentativas. Aguarde um minuto e tente novamente.";
      msgAcesso.className = "mensagem-status mensagem-erro";
      return;
    }

    if (!resposta.ok) {
      msgAcesso.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
      msgAcesso.className = "mensagem-status mensagem-erro";
      return;
    }

    const json = await resposta.json();
    
    // Sucesso no Login
    pinSessao = pinDigitado;
    inputPin.value = ""; // Limpa a senha do campo por segurança

    // Define os dados a utilizar
    if (json.dados && Array.isArray(json.dados.disciplinas) && json.dados.disciplinas.length > 0) {
      // Regra: DADOS DA API > DADOS LOCAIS
      dadosAtuais = json.dados.disciplinas;
    } else {
      // Quando não existirem dados salvos na API
      dadosAtuais = JSON.parse(JSON.stringify(dadosBoletimLocal));
    }

    // Exibe a tela principal
    document.getElementById("secao-acesso").style.display = "none";
    document.getElementById("conteudo-boletim").style.display = "block";

    renderizarBoletim();

  } catch (erro) {
    msgAcesso.textContent = "Não foi possível conectar ao servidor. Tente novamente.";
    msgAcesso.className = "mensagem-status mensagem-erro";
  }
}

// Montar Formulário de Edição
function abrirEdicao() {
  const container = document.getElementById("container-edicao-disciplinas");
  container.innerHTML = "";
  document.getElementById("mensagem-edicao").textContent = "";

  dadosAtuais.forEach((item, index) => {
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);
    
    let f1 = 0, f2 = 0, f3 = 0;
    if (Array.isArray(item.faltas)) {
      f1 = item.faltas[0] !== undefined ? item.faltas[0] : 0;
      f2 = item.faltas[1] !== undefined ? item.faltas[1] : 0;
      f3 = item.faltas[2] !== undefined ? item.faltas[2] : 0;
    }

    const card = document.createElement("div");
    card.className = "edicao-card-item";

    const titulo = document.createElement("h4");
    titulo.textContent = item.disciplina;
    card.appendChild(titulo);

    const divCampos = document.createElement("div");
    divCampos.className = "edicao-campos";

    divCampos.innerHTML = `
      <div class="campo-grupo">
        <label>Nota 1º Tri:</label>
        <input type="text" id="edit-n1-${index}" value="${n1 !== null ? n1 : ''}">
      </div>
      <div class="campo-grupo">
        <label>Nota 2º Tri:</label>
        <input type="text" id="edit-n2-${index}" value="${n2 !== null ? n2 : ''}">
      </div>
      <div class="campo-grupo">
        <label>Nota 3º Tri:</label>
        <input type="text" id="edit-n3-${index}" value="${n3 !== null ? n3 : ''}">
      </div>
      <div class="campo-grupo">
        <label>Faltas 1º Tri:</label>
        <input type="number" id="edit-f1-${index}" value="${f1}">
      </div>
      <div class="campo-grupo">
        <label>Faltas 2º Tri:</label>
        <input type="number" id="edit-f2-${index}" value="${f2}">
      </div>
      <div class="campo-grupo">
        <label>Faltas 3º Tri:</label>
        <input type="number" id="edit-f3-${index}" value="${f3}">
      </div>
    `;

    card.appendChild(divCampos);
    container.appendChild(card);
  });

  document.getElementById("secao-edicao").style.display = "block";
}

// Validar Nota Digitada pelo Aluno (0 a 10 ou Vazio)
function validarEConverterNotaEditada(valorStr, inputElem) {
  const texto = valorStr.trim().replace(",", ".");
  if (texto === "") {
    inputElem.classList.remove("campo-invalido");
    return null;
  }
  
  const num = Number(texto);
  if (isNaN(num) || num < 0 || num > 10) {
    inputElem.classList.add("campo-invalido");
    return false;
  }

  inputElem.classList.remove("campo-invalido");
  return num;
}

// Validar Falta Digitada pelo Aluno (Inteiro >= 0)
function validarEConverterFaltaEditada(valorStr, inputElem) {
  const texto = valorStr.trim();
  if (texto === "") {
    inputElem.classList.add("campo-invalido");
    return false;
  }

  const num = Number(texto);
  if (isNaN(num) || !Number.isInteger(num) || num < 0) {
    inputElem.classList.add("campo-invalido");
    return false;
  }

  inputElem.classList.remove("campo-invalido");
  return num;
}

// Salvar alterações na API
async function salvarEdicao() {
  const msgEdicao = document.getElementById("mensagem-edicao");
  msgEdicao.textContent = "";

  let temErro = false;
  const novasDisciplinas = [];

  for (let i = 0; i < dadosAtuais.length; i++) {
    const inputN1 = document.getElementById(`edit-n1-${i}`);
    const inputN2 = document.getElementById(`edit-n2-${i}`);
    const inputN3 = document.getElementById(`edit-n3-${i}`);
    const inputF1 = document.getElementById(`edit-f1-${i}`);
    const inputF2 = document.getElementById(`edit-f2-${i}`);
    const inputF3 = document.getElementById(`edit-f3-${i}`);

    const n1Val = validarEConverterNotaEditada(inputN1.value, inputN1);
    const n2Val = validarEConverterNotaEditada(inputN2.value, inputN2);
    const n3Val = validarEConverterNotaEditada(inputN3.value, inputN3);

    const f1Val = validarEConverterFaltaEditada(inputF1.value, inputF1);
    const f2Val = validarEConverterFaltaEditada(inputF2.value, inputF2);
    const f3Val = validarEConverterFaltaEditada(inputF3.value, inputF3);

    if (n1Val === false || n2Val === false || n3Val === false ||
        f1Val === false || f2Val === false || f3Val === false) {
      temErro = true;
    } else {
      novasDisciplinas.push({
        disciplina: dadosAtuais[i].disciplina,
        tri1: n1Val,
        tri2: n2Val,
        tri3: n3Val,
        faltas: [f1Val, f2Val, f3Val]
      });
    }
  }

  if (temErro) {
    msgEdicao.textContent = "Por favor, corrija os campos em vermelho antes de salvar.";
    msgEdicao.className = "mensagem-status mensagem-erro";
    return;
  }

  msgEdicao.textContent = "Salvando...";
  msgEdicao.className = "mensagem-status mensagem-info";

  try {
    const resposta = await fetch(`${CONFIG_ALUNO.apiUrl}/api/v1/boletins/salvar`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turma: CONFIG_ALUNO.turma,
        numero_chamada: CONFIG_ALUNO.numeroChamada,
        pin: pinSessao,
        dados: {
          disciplinas: novasDisciplinas
        }
      })
    });

    if (!resposta.ok) {
      msgEdicao.textContent = "Erro ao salvar alterações no servidor. Tente novamente.";
      msgEdicao.className = "mensagem-status mensagem-erro";
      return;
    }

    // Sucesso ao salvar
    dadosAtuais = novasDisciplinas;
    renderizarBoletim();

    msgEdicao.textContent = "Dados salvos com sucesso!";
    msgEdicao.className = "mensagem-status mensagem-sucesso";

    setTimeout(() => {
      document.getElementById("secao-edicao").style.display = "none";
      msgEdicao.textContent = "";
    }, 1500);

  } catch (erro) {
    msgEdicao.textContent = "Erro ao conectar com o servidor para salvar. Tente novamente.";
    msgEdicao.className = "mensagem-status mensagem-erro";
  }
}

// Eventos dos botões
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-entrar").addEventListener("click", entrarBoletim);
  document.getElementById("input-pin").addEventListener("keypress", (e) => {
    if (e.key === "Enter") entrarBoletim();
  });

  document.getElementById("btn-alterar").addEventListener("click", abrirEdicao);
  document.getElementById("btn-salvar").addEventListener("click", salvarEdicao);
  document.getElementById("btn-cancelar").addEventListener("click", () => {
    document.getElementById("secao-edicao").style.display = "none";
  });
});