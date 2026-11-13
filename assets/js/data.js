/* ==========================================================
   PERGUNTAS E PERFIS — baseados no material DISC
   D = Dominante · I = Influente · S = Estável · C = Analítico
   ========================================================== */

window.DISC_QUESTIONS = [
  {
    q: 'Numa roda de mulheres que você acabou de conhecer, você geralmente…',
    o: [
      { k: 'D', t: 'Puxa a iniciativa e logo propõe o que fazer' },
      { k: 'I', t: 'Já está conversando com todo mundo e arrancando risadas' },
      { k: 'S', t: 'Fica perto de quem parece tímida e faz ela se sentir à vontade' },
      { k: 'C', t: 'Observa primeiro, sente o clima e só depois se abre' }
    ]
  },
  {
    q: 'Uma amiga te conta que está passando por um problema. Sua primeira reação é…',
    o: [
      { k: 'D', t: 'Ir direto à solução: “ok, o que a gente vai fazer?”' },
      { k: 'I', t: 'Levantar o astral dela e lembrar que vai dar tudo certo' },
      { k: 'S', t: 'Ouvir com calma, sem pressa, e simplesmente estar presente' },
      { k: 'C', t: 'Fazer perguntas para entender exatamente o que aconteceu' }
    ]
  },
  {
    q: 'No grupo de WhatsApp das amigas, você é a que…',
    o: [
      { k: 'D', t: 'Marca a data e cobra quem ainda não confirmou' },
      { k: 'I', t: 'Manda áudio, figurinha e anima a conversa' },
      { k: 'S', t: 'Responde todo mundo com carinho e não deixa ninguém no vácuo' },
      { k: 'C', t: 'Lê tudo e responde quando tem algo relevante a dizer' }
    ]
  },
  {
    q: 'Vão organizar uma viagem só de amigas. Seu papel natural é…',
    o: [
      { k: 'D', t: 'Decidir o destino e fazer a viagem sair do papel' },
      { k: 'I', t: 'Montar a playlist, combinar os looks e garantir a diversão' },
      { k: 'S', t: 'Cuidar para que todas se sintam incluídas e confortáveis' },
      { k: 'C', t: 'Montar a planilha de gastos, o roteiro e as reservas' }
    ]
  },
  {
    q: 'O que mais te incomoda em uma amizade?',
    o: [
      { k: 'D', t: 'Enrolação e gente que não cumpre o que combinou' },
      { k: 'I', t: 'Frieza e falta de entusiasmo' },
      { k: 'S', t: 'Brigas, gritos e clima pesado' },
      { k: 'C', t: 'Promessas vagas e desorganização' }
    ]
  },
  {
    q: 'Quando surge um conflito entre você e uma amiga, você tende a…',
    o: [
      { k: 'D', t: 'Falar na hora, de forma direta, e resolver logo' },
      { k: 'I', t: 'Quebrar o gelo com leveza e voltar ao normal' },
      { k: 'S', t: 'Evitar o confronto e esperar a poeira baixar' },
      { k: 'C', t: 'Pensar bastante e voltar com argumentos bem claros' }
    ]
  },
  {
    q: 'Qual destes elogios mais toca o seu coração?',
    o: [
      { k: 'D', t: '“Você é corajosa, faz as coisas acontecerem!”' },
      { k: 'I', t: '“Você ilumina qualquer lugar que chega!”' },
      { k: 'S', t: '“Eu sei que sempre posso contar com você.”' },
      { k: 'C', t: '“Tudo o que você faz é impecável.”' }
    ]
  },
  {
    q: 'Num sábado livre, o programa ideal é…',
    o: [
      { k: 'D', t: 'Algo novo e desafiador: uma trilha, um curso, uma aventura' },
      { k: 'I', t: 'Festa, encontro, gente nova e muita conversa' },
      { k: 'S', t: 'Um café ou almoço tranquilo com as amigas de sempre' },
      { k: 'C', t: 'Um tempo só meu: um livro, uma série, um projeto pessoal' }
    ]
  },
  {
    q: 'O plano com as amigas mudou em cima da hora. Você…',
    o: [
      { k: 'D', t: 'Se adapta rápido e já assume o comando do novo plano' },
      { k: 'I', t: 'Acha ótimo, imprevisto sempre vira uma boa história' },
      { k: 'S', t: 'Fica desconfortável; prefere saber das coisas com antecedência' },
      { k: 'C', t: 'Quer entender o motivo e reorganizar tudo antes de topar' }
    ]
  },
  {
    q: 'Como você costuma tomar decisões importantes?',
    o: [
      { k: 'D', t: 'Rápido: confio no meu instinto e assumo' },
      { k: 'I', t: 'Pelo coração e pela empolgação do momento' },
      { k: 'S', t: 'Com calma, ouvindo antes as pessoas que eu amo' },
      { k: 'C', t: 'Pesquisando, listando prós e contras e analisando bem' }
    ]
  },
  {
    q: 'Suas amigas mais próximas te descreveriam como…',
    o: [
      { k: 'D', t: 'Firme, decidida e independente' },
      { k: 'I', t: 'Alegre, comunicativa e espontânea' },
      { k: 'S', t: 'Calma, leal e boa ouvinte' },
      { k: 'C', t: 'Organizada, cuidadosa e precisa' }
    ]
  },
  {
    q: 'O que você mais precisa receber de uma amizade?',
    o: [
      { k: 'D', t: 'Respeito ao meu espaço e às minhas decisões' },
      { k: 'I', t: 'Atenção, carinho e reconhecimento' },
      { k: 'S', t: 'Lealdade e a certeza de que ela vai estar lá' },
      { k: 'C', t: 'Coerência e uma confiança construída com o tempo' }
    ]
  },
  {
    q: 'Quando a pressão aperta, você costuma…',
    o: [
      { k: 'D', t: 'Ficar ainda mais focada, e às vezes mais impaciente' },
      { k: 'I', t: 'Falar mais, prometer demais e se dispersar' },
      { k: 'S', t: 'Guardar para si e concordar para não criar atrito' },
      { k: 'C', t: 'Se cobrar demais e travar tentando acertar' }
    ]
  },
  {
    q: 'Num relacionamento, o que mais te dá medo é…',
    o: [
      { k: 'D', t: 'Perder a liberdade de ser quem eu sou' },
      { k: 'I', t: 'Ser rejeitada ou deixada de lado' },
      { k: 'S', t: 'Perder a paz e a estabilidade que construímos' },
      { k: 'C', t: 'Ser criticada ou decepcionar alguém' }
    ]
  },
  {
    q: 'Na hora de contar uma grande novidade para as amigas, você…',
    o: [
      { k: 'D', t: 'Vai direto ao ponto: o quê, quando e onde' },
      { k: 'I', t: 'Conta com detalhes, emoção e muitos gestos' },
      { k: 'S', t: 'Escolhe o momento certo e conta com delicadeza' },
      { k: 'C', t: 'Só conta quando tem certeza e está tudo confirmado' }
    ]
  },
  {
    q: 'Se pudesse escolher um superpoder nas suas amizades, seria…',
    o: [
      { k: 'D', t: 'Coragem para abrir caminhos para as outras' },
      { k: 'I', t: 'Contagiar todo mundo com alegria' },
      { k: 'S', t: 'Levar paz e acolhimento a qualquer coração' },
      { k: 'C', t: 'Enxergar o que ninguém mais está vendo' }
    ]
  }
];

window.DISC_PROFILES = {
  D: {
    letter: 'D',
    nome: 'Dominante',
    apelido: 'A Determinada',
    tagline: 'A amiga que faz acontecer',
    cor: '#E25C4B',
    corSoft: '#FCE3DF',
    descricao:
      'Você é direta, decidida e tem uma energia que movimenta as pessoas. Nas amizades, é quem transforma o “um dia a gente faz” em data marcada. Gosta de desafios, confia no próprio instinto e não tem medo de ir à frente quando ninguém mais vai.',
    tracos: ['Autoconfiante', 'Decidida', 'Direta', 'Corajosa', 'Independente', 'Competitiva'],
    superpoderes: [
      'Tira os planos do papel e mobiliza o grupo',
      'É firme quando uma amiga precisa de alguém que a defenda',
      'Mantém o sangue-frio e age rápido nas emergências',
      'Inspira as outras mulheres a serem mais ousadas'
    ],
    precisa: [
      'Objetividade: vá direto ao ponto, sem rodeios',
      'Pontualidade, porque perder tempo te deixa impaciente',
      'Respeito à sua autonomia e às suas escolhas',
      'Amigas confiantes, que tragam soluções e não só problemas'
    ],
    atencao: [
      'Ter paciência com quem tem um ritmo diferente do seu',
      'Ouvir até o fim antes de propor a solução',
      'Cuidar do tom de voz: sua firmeza pode soar como dureza',
      'Acolher os sentimentos das amigas, não só os fatos'
    ],
    pressao:
      'Você fica ainda mais focada e produtiva. Mas, se a tensão passa do limite, a impaciência pode falar mais alto.',
    decisao: 'Rápida, intuitiva e racional.',
    medo: 'Perder a autonomia e o controle da própria vida.',
    conviver:
      'Seja direta, objetiva e pontual. Traga soluções em vez de rodeios e respeite a autonomia dela.',
    desafio:
      'Na próxima vez que uma amiga desabafar, segure a vontade de resolver. Pergunte “como você está se sentindo?” e só escute até o fim.',
    secundario: 'um toque de coragem e iniciativa: você sabe se posicionar quando é preciso.'
  },
  I: {
    letter: 'I',
    nome: 'Influente',
    apelido: 'A Inspiradora',
    tagline: 'A amiga que acende a roda',
    cor: '#EE9D22',
    corSoft: '#FDEFD6',
    descricao:
      'Você é comunicativa, otimista e contagiante: quando chega, o ambiente muda de temperatura! Faz amizade com facilidade, adora gente, conversa e celebração, e é quem lembra a todas que a vida também precisa ser leve e divertida.',
    tracos: ['Comunicativa', 'Entusiasmada', 'Bem-humorada', 'Espontânea', 'Calorosa', 'Persuasiva'],
    superpoderes: [
      'Conecta pessoas e cria grupos onde todas se sentem bem-vindas',
      'Levanta o astral de qualquer amiga num dia difícil',
      'Demonstra carinho sem vergonha: elogia, abraça, celebra',
      'Tem ideias criativas e sempre enxerga o lado bom'
    ],
    precisa: [
      'Atenção, carinho e tempo de qualidade juntas',
      'Elogios e reconhecimento (em público, melhor ainda!)',
      'Espaço para falar, criar e dar suas ideias',
      'Convites! Programas leves, dinâmicos e acolhedores'
    ],
    atencao: [
      'Ouvir mais e falar um pouquinho menos',
      'Prometer só o que consegue cumprir',
      'Aprender a dizer “não” sem medo de desagradar',
      'Dar atenção a prazos, horários e detalhes combinados'
    ],
    pressao:
      'Você mantém o ritmo e o bom humor, desde que não se sinta rejeitada. O risco é prometer mais do que consegue entregar.',
    decisao: 'Emocional e intuitiva.',
    medo: 'Ser rejeitada ou deixada de lado.',
    conviver:
      'Seja calorosa, elogie, dê espaço para ela falar e chame para programas leves. Frieza e rigidez a afastam.',
    desafio:
      'Na próxima conversa com uma amiga, escute a história inteira sem interromper e faça duas perguntas antes de contar a sua.',
    secundario: 'um toque de alegria e comunicação: você sabe criar conexão com as pessoas.'
  },
  S: {
    letter: 'S',
    nome: 'Estável',
    apelido: 'A Acolhedora',
    tagline: 'A amiga porto seguro',
    cor: '#4FA383',
    corSoft: '#DDF1E8',
    descricao:
      'Você é calma, leal e uma ouvinte rara. É aquela amiga de anos, que aparece quando todo mundo some e que faz qualquer pessoa se sentir em casa. Valoriza relações duradouras, harmonia e a segurança de saber com quem pode contar.',
    tracos: ['Paciente', 'Leal', 'Boa ouvinte', 'Prestativa', 'Conciliadora', 'Equilibrada'],
    superpoderes: [
      'Escuta de verdade, sem julgar e sem pressa',
      'É constante: suas amizades atravessam os anos',
      'Acalma os ânimos e aproxima quem está brigado',
      'Percebe quem está de fora e acolhe'
    ],
    precisa: [
      'Gentileza, paciência e um tom de voz suave',
      'Lealdade e uma confiança construída com o tempo',
      'Interesse genuíno por você: perguntas, presença, cuidado',
      'Mudanças avisadas com antecedência, nada de surpresas bruscas'
    ],
    atencao: [
      'Dizer o que sente e pensa, mesmo quando discorda',
      'Saber dizer “não” e cuidar das suas próprias necessidades',
      'Conversar antes que a mágoa vire rancor',
      'Se abrir um pouco mais ao novo e às mudanças'
    ],
    pressao:
      'Você tende a guardar suas opiniões e concordar para evitar conflito, e depois isso pode pesar por dentro.',
    decisao: 'Cautelosa e emocional.',
    medo: 'Perder a estabilidade, a segurança e a harmonia.',
    conviver:
      'Seja gentil e paciente, construa confiança aos poucos e evite pressão ou mudanças bruscas. Pergunte como ela está e espere a resposta.',
    desafio:
      'Nesta semana, diga uma opinião sincera a uma amiga, mesmo que seja diferente da dela. Ou pratique um “não” dito com carinho.',
    secundario: 'um toque de calma e lealdade: você sabe acolher e cuidar das relações.'
  },
  C: {
    letter: 'C',
    nome: 'Analítica',
    apelido: 'A Criteriosa',
    tagline: 'A amiga que cuida de cada detalhe',
    cor: '#7470D6',
    corSoft: '#E6E5FA',
    descricao:
      'Você é observadora, cuidadosa e profunda. Enxerga detalhes que ninguém vê, pensa antes de falar e, quando fala, acerta em cheio. Demora um pouco para se abrir, mas, quando confia, é uma amiga fiel, que lembra de tudo e faz cada coisa com excelência.',
    tracos: ['Observadora', 'Precisa', 'Organizada', 'Discreta', 'Lógica', 'Caprichosa'],
    superpoderes: [
      'Dá conselhos sensatos, pensados e baseados em fatos',
      'Lembra dos detalhes: datas, gostos, histórias',
      'Organiza o que ninguém quer organizar (e faz bem feito!)',
      'É discreta: segredo com você está seguro'
    ],
    precisa: [
      'Respeito ao seu tempo, ao seu silêncio e à sua privacidade',
      'Coerência: amigas que cumprem o que prometem',
      'Conversas claras e específicas, nada vago',
      'Delicadeza nas críticas, e nunca exposição em público'
    ],
    atencao: [
      'Ser menos exigente consigo mesma e com as outras',
      'Aceitar que nem tudo precisa ser perfeito para ser bom',
      'Demonstrar mais o afeto que você sente',
      'Arriscar mais e confiar sem precisar de tantas garantias'
    ],
    pressao:
      'A cautela e a autocobrança aumentam. Prazos curtos e imprevistos podem te travar enquanto você tenta acertar tudo.',
    decisao: 'Cautelosa e racional.',
    medo: 'Errar, ser criticada ou exposta.',
    conviver:
      'Seja clara, específica e coerente. Respeite o tempo e o espaço dela e faça críticas com delicadeza, sempre em particular.',
    desafio:
      'Nesta semana, faça um elogio espontâneo e em voz alta a uma amiga, sem esperar o momento perfeito.',
    secundario: 'um toque de cuidado e profundidade: você presta atenção ao que realmente importa.'
  }
};

// O que a Análise DISC completa entrega (baseado no relatório de mapeamento)
window.DISC_FULL_ANALYSIS = [
  ['Perfil natural x perfil adaptado', 'Quem você é de verdade e quem o ambiente está exigindo que você seja.'],
  ['A sua combinação única dos 4 perfis', 'Ninguém é um perfil só. Entenda a intensidade de cada um em você.'],
  ['Pontos fortes x pontos limitantes', 'O que potencializar e o que está travando suas relações.'],
  ['Índices de flexibilidade e autoestima', 'Como você se adapta e como enxerga a si mesma.'],
  ['Motivadores e tomada de decisão', 'O que te move e como você escolhe, na vida e na carreira.'],
  ['Devolutiva individual com a Alexsandra', 'Uma conversa para interpretar tudo e montar seu plano de desenvolvimento.']
];
