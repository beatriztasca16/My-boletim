// DADOS FICTÍCIOS PADRONIZADOS - 9º ANO
const dadosBoletim = [
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

// Frequência geral fictícia demonstrativa (será tratada de outra forma no futuro)
const FREQUENCIA_DEMONSTRATIVA = 92;

// Função para normalizar qualquer valor de nota para a escala de 0 a 10
function normalizarNota(valor) {
  if (valor === null || valor === undefined || valor === "") {
    return null;
  }

  // Converte texto com vírgula para número com ponto
  let numero = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : Number(valor);

  if (isNaN(numero) || numero < 0) {
    return null;
  }

  // Ajusta notas acima de 10 (ex: 82 vira 8.2)
  if (numero > 10 && numero <= 100) {
    numero = numero / 10;
  }

  if (numero > 10) {
    return null; // Nota inválida
  }

  return numero;
}

// Função para formatar como a nota deve ser exibida na tabela
function formatarNotaExibicao(notaNormalizada) {
  if (notaNormalizada === null) {
    return "—";
  }
  return notaNormalizada.toFixed(1).replace(".", ",");
}

// Função principal que gera o boletim na página
function carregarBoletim() {
  const tabelaCorpo = document.getElementById("tabela-boletim");
  tabelaCorpo.innerHTML = "";

  let somaMediasGerais = 0;
  let quantDisciplinasComMedia = 0;
  let totalFaltasGeral = 0;
  let totalBomDesempenho = 0;
  let totalAtencao = 0;

  // Percorre cada disciplina do array
  dadosBoletim.forEach(item => {
    // Normaliza as notas dos três trimestres
    const n1 = normalizarNota(item.tri1);
    const n2 = normalizarNota(item.tri2);
    const n3 = normalizarNota(item.tri3);

    // Calcula a média considerando apenas notas válidas
    const notasValidas = [n1, n2, n3].filter(n => n !== null);
    let media = null;
    if (notasValidas.length > 0) {
      const soma = notasValidas.reduce((acc, curr) => acc + curr, 0);
      media = soma / notasValidas.length;
    }

    // Soma as faltas dos três trimestres
    const totalFaltasItem = item.faltas.reduce((acc, curr) => acc + curr, 0);
    totalFaltasGeral += totalFaltasItem;

    // Define a situação da disciplina
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

    // Cria a linha da tabela no DOM
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.disciplina}</strong></td>
      <td>${formatarNotaExibicao(n1)}</td>
      <td>${formatarNotaExibicao(n2)}</td>
      <td>${formatarNotaExibicao(n3)}</td>
      <td><strong>${formatarNotaExibicao(media)}</strong></td>
      <td>${totalFaltasItem}</td>
      <td class="${classeCss}">${situacao}</td>
    `;
    tabelaCorpo.appendChild(tr);
  });

  // Atualiza os Cards de Resumo no DOM
  const mediaGeralFinal = quantDisciplinasComMedia > 0 
    ? (somaMediasGerais / quantDisciplinasComMedia).toFixed(1).replace(".", ",") 
    : "—";

  document.getElementById("card-media-geral").textContent = mediaGeralFinal;
  document.getElementById("card-total-faltas").textContent = totalFaltasGeral;
  document.getElementById("card-bom-desempenho").textContent = totalBomDesempenho;
  document.getElementById("card-atencao").textContent = totalAtencao;
}

// Executa a função assim que a página carregar
document.addEventListener("DOMContentLoaded", carregarBoletim);