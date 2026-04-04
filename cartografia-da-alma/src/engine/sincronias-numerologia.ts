// ═══════════════════════════════════════
// Sincronias — Motor Numerológico
// Ciclos pessoais: Ano, Mês, Dia
// Zero dependências externas
// Matemática pura — sempre rastreável
// ═══════════════════════════════════════
//
// COMO FUNCIONA:
// Cada pessoa tem ciclos numerológicos rodando desde o nascimento.
// O Ano Pessoal muda todo dia 1 de Janeiro.
// O Mês Pessoal muda todo dia 1 de cada mês.
// O Dia Pessoal muda à meia-noite.
// Os três juntos formam o "endereço numerológico" de qualquer momento.
//
// FONTE: sistema pitagórico clássico
// CADEIA: data nascimento + data atual → redução de dígitos → ciclo ativo

// ── Redução de dígitos (sistema pitagórico) ──

function reduce(n: number, keepMaster = true): number {
  // Números mestres 11, 22, 33 não são reduzidos (têm significado próprio)
  while (n > 9) {
    if (keepMaster && (n === 11 || n === 22 || n === 33)) break;
    let sum = 0;
    let temp = n;
    while (temp > 0) {
      sum += temp % 10;
      temp = Math.floor(temp / 10);
    }
    n = sum;
  }
  return n;
}

// ── Ano Pessoal ──
// Fórmula: dia nascimento + mês nascimento + ano ATUAL
// Ex: nasceu 15 Mar, ano 2026 → 1+5 + 3 + 2+0+2+6 = 19 → 10 → 1

export function getAnoPessoal(birthDate: Date, currentYear: number): number {
  const dia = birthDate.getDate();
  const mes = birthDate.getMonth() + 1;
  const anoAtual = currentYear;

  const somaAno = String(anoAtual).split('').reduce((a, d) => a + Number(d), 0);
  return reduce(dia + mes + somaAno);
}

// ── Mês Pessoal ──
// Fórmula: Ano Pessoal + mês atual

export function getMesPessoal(birthDate: Date, currentDate: Date): number {
  const anoPessoal = getAnoPessoal(birthDate, currentDate.getFullYear());
  const mesAtual = currentDate.getMonth() + 1;
  return reduce(anoPessoal + mesAtual);
}

// ── Dia Pessoal ──
// Fórmula: Mês Pessoal + dia atual

export function getDiaPessoal(birthDate: Date, currentDate: Date): number {
  const mesPessoal = getMesPessoal(birthDate, currentDate);
  const diaAtual = currentDate.getDate();
  return reduce(mesPessoal + diaAtual);
}

// ── Significados dos ciclos ──

export interface CicloNumerologico {
  numero: number;
  nome: string;
  tema: string;
  energiaDoDia: string;    // como agir hoje
  sombra: string;          // o que evitar
  intensidade: 1 | 2 | 3; // 1=sutil, 2=moderado, 3=forte
}

const CICLOS: Record<number, Omit<CicloNumerologico, 'numero' | 'intensidade'>> = {
  1: {
    nome: 'Início',
    tema: 'Novo ciclo. Plantio. Decisões que têm peso.',
    energiaDoDia: 'Inicie o que foi adiado. Aja antes de analisar.',
    sombra: 'Impulsividade sem direção. Começar sem terminar.',
  },
  2: {
    nome: 'Cooperação',
    tema: 'Parceria. Paciência. O que não pode ser forçado.',
    energiaDoDia: 'Escute mais do que fala. Colabore em vez de liderar.',
    sombra: 'Dependência. Perder a própria posição pela paz.',
  },
  3: {
    nome: 'Expressão',
    tema: 'Criatividade. Comunicação. O que quer ser dito.',
    energiaDoDia: 'Crie. Expresse. Conecte pessoas e ideias.',
    sombra: 'Dispersão. Superficialidade. Falar sem profundidade.',
  },
  4: {
    nome: 'Fundação',
    tema: 'Estrutura. Trabalho. O que constrói para durar.',
    energiaDoDia: 'Organize. Execute. Construa sem pressa.',
    sombra: 'Rigidez. Resistência ao que não foi planejado.',
  },
  5: {
    nome: 'Mudança',
    tema: 'Movimento. Liberdade. O que não pode ficar parado.',
    energiaDoDia: 'Adapte-se. Explore. Aceite o inesperado.',
    sombra: 'Instabilidade. Fuga das responsabilidades.',
  },
  6: {
    nome: 'Cuidado',
    tema: 'Responsabilidade. Família. O que é preciso sustentar.',
    energiaDoDia: 'Cuide do que importa. Resolva o que foi adiado.',
    sombra: 'Excesso de responsabilidade. Cuidar a custo próprio.',
  },
  7: {
    nome: 'Introspecção',
    tema: 'Análise. Silêncio. O que só emerge no recolhimento.',
    energiaDoDia: 'Aprofunde. Pesquise. Fique consigo.',
    sombra: 'Isolamento. Análise que paralisa a ação.',
  },
  8: {
    nome: 'Poder',
    tema: 'Resultado. Liderança. O que foi construído manifesta.',
    energiaDoDia: 'Execute com autoridade. Colha o que plantou.',
    sombra: 'Controle excessivo. Materialismo sem propósito.',
  },
  9: {
    nome: 'Encerramento',
    tema: 'Ciclo se fecha. O que precisa ser liberado.',
    energiaDoDia: 'Conclua. Perdoe. Libere o que não serve mais.',
    sombra: 'Apego ao que terminou. Dificuldade de soltar.',
  },
  11: {
    nome: 'Intuição Mestre',
    tema: 'Inspiração elevada. O que veio antes do pensamento.',
    energiaDoDia: 'Confie no primeiro impulso. Não racionalize demais.',
    sombra: 'Ansiedade. Sensibilidade que overwhelma.',
  },
  22: {
    nome: 'Construtor Mestre',
    tema: 'Visão em grande escala. O que deixa marca.',
    energiaDoDia: 'Pense grande mas execute no concreto.',
    sombra: 'Grandiosidade paralisante. Medo de não ser suficiente.',
  },
  33: {
    nome: 'Mestre do Cuidado',
    tema: 'Serviço elevado. O que cura sem perder a si mesmo.',
    energiaDoDia: 'Sirva com sabedoria. Cuide sem se perder.',
    sombra: 'Sacrifício excessivo. Martírio como identidade.',
  },
};

function getCicloData(numero: number): Omit<CicloNumerologico, 'numero' | 'intensidade'> {
  return CICLOS[numero] ?? CICLOS[1];
}

// ── Calcular intensidade ──
// Dia Pessoal 1, 9, 11, 22, 33 = intensidade 3 (marcos de ciclo)
// Dia Pessoal = Mês Pessoal = Ano Pessoal (tripla convergência) = intensidade 3
// Dia Pessoal = Número de Expressão natal = intensidade 2

function calcularIntensidade(
  diaPessoal: number,
  mesPessoal: number,
  anoPessoal: number,
  numeroExpressaoNatal: number,
): 1 | 2 | 3 {
  // Tripla convergência
  if (diaPessoal === mesPessoal && mesPessoal === anoPessoal) return 3;

  // Marco de ciclo
  if ([1, 9, 11, 22, 33].includes(diaPessoal)) return 3;

  // Ressonância com número natal
  if (diaPessoal === numeroExpressaoNatal) return 2;
  if (mesPessoal === numeroExpressaoNatal) return 2;

  return 1;
}

// ── Interface de output ──

export interface SincroniaNumeriologica {
  anoPessoal: CicloNumerologico;
  mesPessoal: CicloNumerologico;
  diaPessoal: CicloNumerologico;
  convergencia: boolean;   // 2+ ciclos com o mesmo número
  raro: boolean;           // tripla convergência ou marco de ciclo
  textoResumo: string;     // uma frase sobre este momento
}

// ── Função principal ──

export function getSincroniaNumerologica(
  birthDate: Date,
  numeroExpressaoNatal: number,
  currentDate: Date = new Date(),
): SincroniaNumeriologica {
  const ano = getAnoPessoal(birthDate, currentDate.getFullYear());
  const mes = getMesPessoal(birthDate, currentDate);
  const dia = getDiaPessoal(birthDate, currentDate);

  const intensidade = calcularIntensidade(dia, mes, ano, numeroExpressaoNatal);
  const convergencia = dia === mes || dia === ano || mes === ano;
  const raro = intensidade === 3;

  const anoPessoal: CicloNumerologico = { numero: ano, intensidade, ...getCicloData(ano) };
  const mesPessoal: CicloNumerologico = { numero: mes, intensidade: calcularIntensidade(mes, ano, ano, numeroExpressaoNatal), ...getCicloData(mes) };
  const diaPessoal: CicloNumerologico = { numero: dia, intensidade, ...getCicloData(dia) };

  // Texto resumo: gerado localmente, sem Claude
  let textoResumo = '';
  if (raro && dia === 1) {
    textoResumo = `Ano ${ano} começa um novo ciclo. Dia ${dia} o inicia. O que você plantar agora tem peso diferente.`;
  } else if (raro && dia === 9) {
    textoResumo = `Dia de encerramento dentro do Ano ${ano}. O que precisa terminar está pedindo atenção.`;
  } else if (convergencia) {
    textoResumo = `Mês e Dia convergem em ${dia}. O padrão do ${getCicloData(dia).nome.toLowerCase()} está amplificado hoje.`;
  } else {
    textoResumo = `${getCicloData(dia).tema} — dentro do ciclo maior de ${getCicloData(ano).nome.toLowerCase()} do Ano ${ano}.`;
  }

  return { anoPessoal, mesPessoal, diaPessoal, convergencia, raro, textoResumo };
}

// ── Próxima data notável ──
// Quando é a próxima vez que algo raro acontece para esta pessoa

export function proximaDataNotavel(
  birthDate: Date,
  numeroExpressaoNatal: number,
  fromDate: Date = new Date(),
): { data: Date; descricao: string } {
  const limite = new Date(fromDate);
  limite.setDate(limite.getDate() + 90); // olha 90 dias à frente

  let cursor = new Date(fromDate);
  cursor.setDate(cursor.getDate() + 1); // começa amanhã

  while (cursor < limite) {
    const sincronia = getSincroniaNumerologica(birthDate, numeroExpressaoNatal, cursor);
    if (sincronia.raro) {
      return {
        data: new Date(cursor),
        descricao: sincronia.textoResumo,
      };
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  // Se não encontrou em 90 dias, retorna o primeiro Dia 1 do próximo mês
  const proximo = new Date(fromDate);
  proximo.setMonth(proximo.getMonth() + 1, 1);
  return {
    data: proximo,
    descricao: 'Início de novo ciclo mensal.',
  };
}
