import { Exercise } from './types'

export const exercises: Exercise[] = [
  // PEITO
  {
    id: 'supino-reto-barra',
    name: 'Supino Reto com Barra',
    muscleGroup: 'peito',
    equipment: 'barra',
    instructions: [
      'Deite no banco com os pés apoiados no chão',
      'Segure a barra com as mãos um pouco mais afastadas que a largura dos ombros',
      'Desça a barra até o peito de forma controlada',
      'Empurre a barra para cima até estender os braços',
    ],
  },
  {
    id: 'supino-inclinado-barra',
    name: 'Supino Inclinado com Barra',
    muscleGroup: 'peito',
    equipment: 'barra',
    instructions: [
      'Ajuste o banco em inclinação de 30-45 graus',
      'Segure a barra com pegada média',
      'Desça até a parte superior do peito',
      'Empurre para cima mantendo os cotovelos levemente para dentro',
    ],
  },
  {
    id: 'supino-reto-halteres',
    name: 'Supino Reto com Halteres',
    muscleGroup: 'peito',
    equipment: 'halteres',
    instructions: [
      'Deite no banco segurando um halter em cada mão',
      'Posicione os halteres na altura do peito',
      'Empurre para cima juntando os halteres no topo',
      'Desça controladamente até os cotovelos ficarem na linha do peito',
    ],
  },
  {
    id: 'crucifixo-halteres',
    name: 'Crucifixo com Halteres',
    muscleGroup: 'peito',
    equipment: 'halteres',
    instructions: [
      'Deite no banco com halteres acima do peito',
      'Com os cotovelos levemente flexionados, abra os braços',
      'Desça até sentir alongamento no peito',
      'Retorne à posição inicial em movimento de abraço',
    ],
  },
  {
    id: 'crossover-cabo',
    name: 'Crossover no Cabo',
    muscleGroup: 'peito',
    equipment: 'cabo',
    instructions: [
      'Posicione as polias na altura dos ombros',
      'Segure as alças e dê um passo à frente',
      'Traga as mãos para frente do corpo em arco',
      'Retorne controladamente mantendo a tensão',
    ],
  },
  {
    id: 'flexao-bracos',
    name: 'Flexão de Braços',
    muscleGroup: 'peito',
    equipment: 'peso-corporal',
    instructions: [
      'Posicione as mãos no chão na largura dos ombros',
      'Mantenha o corpo reto da cabeça aos pés',
      'Desça o corpo até o peito quase tocar o chão',
      'Empurre para cima estendendo os braços',
    ],
  },

  // COSTAS
  {
    id: 'puxada-frontal',
    name: 'Puxada Frontal',
    muscleGroup: 'costas',
    equipment: 'maquina',
    instructions: [
      'Sente na máquina e ajuste a almofada nas coxas',
      'Segure a barra com pegada aberta',
      'Puxe a barra até a altura do peito',
      'Retorne controladamente esticando os braços',
    ],
  },
  {
    id: 'remada-curvada',
    name: 'Remada Curvada com Barra',
    muscleGroup: 'costas',
    equipment: 'barra',
    instructions: [
      'Segure a barra com pegada pronada',
      'Incline o tronco a 45 graus mantendo as costas retas',
      'Puxe a barra até a região abdominal',
      'Desça controladamente estendendo os braços',
    ],
  },
  {
    id: 'remada-unilateral',
    name: 'Remada Unilateral com Halter',
    muscleGroup: 'costas',
    equipment: 'halteres',
    instructions: [
      'Apoie um joelho e uma mão no banco',
      'Segure o halter com a mão oposta',
      'Puxe o halter até a região da cintura',
      'Desça controladamente e repita',
    ],
  },
  {
    id: 'remada-cavalinho',
    name: 'Remada Cavalinho',
    muscleGroup: 'costas',
    equipment: 'maquina',
    instructions: [
      'Sente na máquina com o peito apoiado',
      'Segure as alças com pegada neutra',
      'Puxe os cotovelos para trás contraindo as costas',
      'Retorne à posição inicial com controle',
    ],
  },
  {
    id: 'pulldown-triangulo',
    name: 'Pulldown com Triângulo',
    muscleGroup: 'costas',
    equipment: 'cabo',
    instructions: [
      'Conecte o triângulo na polia alta',
      'Sente e segure o triângulo com pegada neutra',
      'Puxe até a altura do peito',
      'Retorne controladamente',
    ],
  },
  {
    id: 'barra-fixa',
    name: 'Barra Fixa',
    muscleGroup: 'costas',
    equipment: 'peso-corporal',
    instructions: [
      'Segure a barra com pegada pronada',
      'Puxe o corpo até o queixo passar a barra',
      'Desça controladamente',
      'Evite balanço do corpo',
    ],
  },

  // OMBROS
  {
    id: 'desenvolvimento-halteres',
    name: 'Desenvolvimento com Halteres',
    muscleGroup: 'ombros',
    equipment: 'halteres',
    instructions: [
      'Sente com os halteres na altura dos ombros',
      'Empurre os halteres para cima',
      'Estenda completamente os braços',
      'Desça controladamente até a posição inicial',
    ],
  },
  {
    id: 'desenvolvimento-barra',
    name: 'Desenvolvimento com Barra',
    muscleGroup: 'ombros',
    equipment: 'barra',
    instructions: [
      'Segure a barra na altura dos ombros',
      'Empurre a barra para cima',
      'Estenda os braços completamente',
      'Desça controladamente até os ombros',
    ],
  },
  {
    id: 'elevacao-lateral',
    name: 'Elevação Lateral',
    muscleGroup: 'ombros',
    equipment: 'halteres',
    instructions: [
      'Segure os halteres ao lado do corpo',
      'Eleve os braços lateralmente até a altura dos ombros',
      'Mantenha os cotovelos levemente flexionados',
      'Desça controladamente',
    ],
  },
  {
    id: 'elevacao-frontal',
    name: 'Elevação Frontal',
    muscleGroup: 'ombros',
    equipment: 'halteres',
    instructions: [
      'Segure os halteres à frente das coxas',
      'Eleve um braço de cada vez até a altura dos ombros',
      'Mantenha o braço estendido',
      'Desça controladamente e alterne',
    ],
  },
  {
    id: 'crucifixo-invertido',
    name: 'Crucifixo Invertido',
    muscleGroup: 'ombros',
    equipment: 'halteres',
    instructions: [
      'Incline o tronco à frente',
      'Segure os halteres com os braços pendentes',
      'Eleve os braços lateralmente',
      'Contraia o deltóide posterior no topo',
    ],
  },
  {
    id: 'encolhimento-ombros',
    name: 'Encolhimento de Ombros',
    muscleGroup: 'ombros',
    equipment: 'halteres',
    instructions: [
      'Segure os halteres ao lado do corpo',
      'Eleve os ombros em direção às orelhas',
      'Segure a contração por 1 segundo',
      'Desça controladamente',
    ],
  },

  // BÍCEPS
  {
    id: 'rosca-direta',
    name: 'Rosca Direta com Barra',
    muscleGroup: 'biceps',
    equipment: 'barra',
    instructions: [
      'Segure a barra com pegada supinada',
      'Mantenha os cotovelos junto ao corpo',
      'Flexione os cotovelos levantando a barra',
      'Desça controladamente sem mover os cotovelos',
    ],
  },
  {
    id: 'rosca-alternada',
    name: 'Rosca Alternada com Halteres',
    muscleGroup: 'biceps',
    equipment: 'halteres',
    instructions: [
      'Segure os halteres ao lado do corpo',
      'Flexione um braço de cada vez',
      'Gire o punho durante o movimento',
      'Desça controladamente e alterne',
    ],
  },
  {
    id: 'rosca-martelo',
    name: 'Rosca Martelo',
    muscleGroup: 'biceps',
    equipment: 'halteres',
    instructions: [
      'Segure os halteres com pegada neutra',
      'Flexione os cotovelos mantendo a pegada',
      'Eleve até a altura dos ombros',
      'Desça controladamente',
    ],
  },
  {
    id: 'rosca-scott',
    name: 'Rosca Scott',
    muscleGroup: 'biceps',
    equipment: 'barra',
    instructions: [
      'Apoie os braços no banco Scott',
      'Segure a barra com pegada supinada',
      'Flexione os cotovelos',
      'Desça até quase estender os braços',
    ],
  },
  {
    id: 'rosca-concentrada',
    name: 'Rosca Concentrada',
    muscleGroup: 'biceps',
    equipment: 'halteres',
    instructions: [
      'Sente e apoie o cotovelo na parte interna da coxa',
      'Segure o halter com o braço estendido',
      'Flexione o cotovelo contraindo o bíceps',
      'Desça controladamente',
    ],
  },

  // TRÍCEPS
  {
    id: 'triceps-corda',
    name: 'Tríceps na Corda',
    muscleGroup: 'triceps',
    equipment: 'cabo',
    instructions: [
      'Segure a corda na polia alta',
      'Mantenha os cotovelos junto ao corpo',
      'Estenda os cotovelos empurrando para baixo',
      'Abra as mãos no final do movimento',
    ],
  },
  {
    id: 'triceps-testa',
    name: 'Tríceps Testa',
    muscleGroup: 'triceps',
    equipment: 'barra',
    instructions: [
      'Deite no banco segurando a barra',
      'Mantenha os cotovelos apontados para cima',
      'Flexione os cotovelos descendo a barra até a testa',
      'Estenda os cotovelos voltando à posição inicial',
    ],
  },
  {
    id: 'triceps-frances',
    name: 'Tríceps Francês',
    muscleGroup: 'triceps',
    equipment: 'halteres',
    instructions: [
      'Segure um halter com as duas mãos atrás da cabeça',
      'Mantenha os cotovelos apontados para cima',
      'Estenda os cotovelos levantando o halter',
      'Desça controladamente',
    ],
  },
  {
    id: 'mergulho-banco',
    name: 'Mergulho no Banco',
    muscleGroup: 'triceps',
    equipment: 'peso-corporal',
    instructions: [
      'Apoie as mãos no banco atrás do corpo',
      'Estenda as pernas à frente',
      'Flexione os cotovelos descendo o corpo',
      'Empurre para cima estendendo os braços',
    ],
  },
  {
    id: 'triceps-kickback',
    name: 'Tríceps Kickback',
    muscleGroup: 'triceps',
    equipment: 'halteres',
    instructions: [
      'Incline o tronco à frente',
      'Mantenha o cotovelo junto ao corpo',
      'Estenda o cotovelo empurrando o halter para trás',
      'Flexione retornando à posição inicial',
    ],
  },

  // PERNAS
  {
    id: 'agachamento-livre',
    name: 'Agachamento Livre',
    muscleGroup: 'pernas',
    equipment: 'barra',
    instructions: [
      'Posicione a barra nos trapézios',
      'Pés na largura dos ombros',
      'Desça flexionando os joelhos e quadris',
      'Suba empurrando o chão com os pés',
    ],
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: [
      'Sente na máquina com as costas apoiadas',
      'Posicione os pés na plataforma',
      'Desça a plataforma flexionando os joelhos',
      'Empurre de volta sem travar os joelhos',
    ],
  },
  {
    id: 'cadeira-extensora',
    name: 'Cadeira Extensora',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: [
      'Sente na máquina e ajuste o encosto',
      'Posicione os tornozelos sob a almofada',
      'Estenda os joelhos levantando o peso',
      'Desça controladamente',
    ],
  },
  {
    id: 'mesa-flexora',
    name: 'Mesa Flexora',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: [
      'Deite de bruços na máquina',
      'Posicione os tornozelos sob a almofada',
      'Flexione os joelhos trazendo os calcanhares aos glúteos',
      'Desça controladamente',
    ],
  },
  {
    id: 'stiff',
    name: 'Stiff',
    muscleGroup: 'pernas',
    equipment: 'barra',
    instructions: [
      'Segure a barra com os braços estendidos',
      'Mantendo as pernas quase retas, incline o tronco',
      'Desça a barra até sentir alongamento nos isquiotibiais',
      'Suba contraindo glúteos e isquiotibiais',
    ],
  },
  {
    id: 'afundo',
    name: 'Afundo (Passada)',
    muscleGroup: 'pernas',
    equipment: 'halteres',
    instructions: [
      'Segure os halteres ao lado do corpo',
      'Dê um passo à frente',
      'Desça até o joelho de trás quase tocar o chão',
      'Empurre de volta e alterne as pernas',
    ],
  },
  {
    id: 'panturrilha-em-pe',
    name: 'Panturrilha em Pé',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: [
      'Posicione os ombros sob as almofadas',
      'Apoie a ponta dos pés na plataforma',
      'Eleve os calcanhares o máximo possível',
      'Desça controladamente alongando a panturrilha',
    ],
  },
  {
    id: 'hack-squat',
    name: 'Hack Squat',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: [
      'Posicione as costas no encosto da máquina',
      'Pés na plataforma na largura dos ombros',
      'Desça flexionando os joelhos',
      'Suba empurrando a plataforma',
    ],
  },

  // GLÚTEOS
  {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    muscleGroup: 'gluteos',
    equipment: 'barra',
    instructions: [
      'Apoie as costas no banco',
      'Posicione a barra sobre o quadril',
      'Eleve o quadril contraindo os glúteos',
      'Desça controladamente',
    ],
  },
  {
    id: 'elevacao-pelvica',
    name: 'Elevação Pélvica',
    muscleGroup: 'gluteos',
    equipment: 'peso-corporal',
    instructions: [
      'Deite de costas com os joelhos flexionados',
      'Eleve o quadril contraindo os glúteos',
      'Segure a contração no topo',
      'Desça controladamente',
    ],
  },
  {
    id: 'abdutora',
    name: 'Cadeira Abdutora',
    muscleGroup: 'gluteos',
    equipment: 'maquina',
    instructions: [
      'Sente na máquina com as pernas na parte interna das almofadas',
      'Abra as pernas empurrando as almofadas',
      'Segure a contração por 1 segundo',
      'Retorne controladamente',
    ],
  },
  {
    id: 'coice-gluteo',
    name: 'Coice para Glúteo',
    muscleGroup: 'gluteos',
    equipment: 'cabo',
    instructions: [
      'Prenda o tornozelo na polia baixa',
      'Apoie-se na estrutura da máquina',
      'Empurre a perna para trás e para cima',
      'Retorne controladamente',
    ],
  },

  // ABDÔMEN
  {
    id: 'abdominal-crunch',
    name: 'Abdominal Crunch',
    muscleGroup: 'abdomen',
    equipment: 'peso-corporal',
    instructions: [
      'Deite de costas com os joelhos flexionados',
      'Coloque as mãos atrás da cabeça',
      'Eleve os ombros do chão contraindo o abdômen',
      'Desça controladamente',
    ],
  },
  {
    id: 'prancha',
    name: 'Prancha',
    muscleGroup: 'abdomen',
    equipment: 'peso-corporal',
    instructions: [
      'Apoie os antebraços e pontas dos pés no chão',
      'Mantenha o corpo reto como uma tábua',
      'Contraia o abdômen e glúteos',
      'Mantenha a posição pelo tempo determinado',
    ],
  },
  {
    id: 'abdominal-infra',
    name: 'Abdominal Infra',
    muscleGroup: 'abdomen',
    equipment: 'peso-corporal',
    instructions: [
      'Deite de costas com as mãos ao lado do corpo',
      'Eleve as pernas mantendo-as retas',
      'Suba até os quadris saírem do chão',
      'Desça controladamente',
    ],
  },
  {
    id: 'abdominal-obliquo',
    name: 'Abdominal Oblíquo',
    muscleGroup: 'abdomen',
    equipment: 'peso-corporal',
    instructions: [
      'Deite de costas com os joelhos flexionados',
      'Leve o cotovelo em direção ao joelho oposto',
      'Alterne os lados de forma contínua',
      'Mantenha a região lombar no chão',
    ],
  },
  {
    id: 'abdominal-maquina',
    name: 'Abdominal na Máquina',
    muscleGroup: 'abdomen',
    equipment: 'maquina',
    instructions: [
      'Sente na máquina e ajuste o peso',
      'Segure as alças na altura do peito',
      'Flexione o tronco para baixo',
      'Retorne controladamente',
    ],
  },
  
  // EXTRAS IMPORTADOS 
  {
    id: 'walking',
    name: 'Caminhada',
    muscleGroup: 'cardio',
    equipment: 'peso-corporal',
    instructions: ['Caminhada em ritmo constante.'],
  },
  {
    id: 'cross-trainer',
    name: 'Elíptico (Cross Trainer)',
    muscleGroup: 'cardio',
    equipment: 'maquina',
    instructions: ['Movimento contínuo na máquina elíptica.'],
  },
  {
    id: 'seated-leg-press',
    name: 'Leg Press Sentado',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: ['Execute o movimento no Leg Press sentado horizontal.'],
  },
  {
    id: 'seated-leg-curl',
    name: 'Cadeira Flexora',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: ['Sente-se no aparelho e flexione os joelhos para baixo.'],
  },
  {
    id: 'calf-raise-leg-press',
    name: 'Panturrilha no Leg Press',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: ['Execute a extensão de panturrilhas usando o Leg Press.'],
  },
  {
    id: 'standing-leg-curl',
    name: 'Mesa Flexora em Pé',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: ['Em pé, flexione um joelho de cada vez contra a resistência.'],
  },
  {
    id: 'one-legged-leg-extension',
    name: 'Cadeira Extensora Unilateral',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: ['Execute a extensão de joelhos usando apenas uma perna por vez.'],
  },
  {
    id: 'hip-adduction',
    name: 'Cadeira Adutora',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: ['Sente-se na máquina e feche as pernas contra a resistência.'],
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Agachamento Búlgaro',
    muscleGroup: 'pernas',
    equipment: 'halteres',
    instructions: ['Com um pé apoiado num banco atrás de você, agache com a perna da frente.'],
  },
  {
    id: 'seated-calf-raise',
    name: 'Panturrilha Sentado',
    muscleGroup: 'pernas',
    equipment: 'maquina',
    instructions: ['No banco específico, levante o peso usando a ponta dos pés.'],
  },
  {
    id: 'landmine-hack-squat',
    name: 'Agachamento Landmine',
    muscleGroup: 'pernas',
    equipment: 'barra',
    instructions: ['Segurando a barra fixada em um ponto, agache mantendo o tronco ereto.'],
  },
  {
    id: 'machine-back-extension',
    name: 'Extensão Lombar na Máquina',
    muscleGroup: 'costas',
    equipment: 'maquina',
    instructions: ['Sente-se na máquina e estenda as costas contra a almofada.'],
  },
  {
    id: 'straight-arm-lat-pulldown',
    name: 'Pulldown Braços Esticados',
    muscleGroup: 'costas',
    equipment: 'cabo',
    instructions: ['Com braços retos, puxe a barra da polia alta até a altura da coxa.'],
  },
  {
    id: 'machine-lat-pulldown',
    name: 'Puxada Articulada (Máquina)',
    muscleGroup: 'costas',
    equipment: 'maquina',
    instructions: ['Puxe as alças da máquina articulada na sua direção.'],
  },
  {
    id: 'cable-close-grip-row',
    name: 'Remada Baixa com Triângulo',
    muscleGroup: 'costas',
    equipment: 'cabo',
    instructions: ['Use o triângulo na polia baixa para puxar o peso contra o abdômen.'],
  },
  {
    id: 'cable-wide-grip-row',
    name: 'Remada Baixa Aberta',
    muscleGroup: 'costas',
    equipment: 'cabo',
    instructions: ['Use a barra reta ou pegada aberta na polia baixa.'],
  },
  {
    id: 'assisted-pull-up',
    name: 'Barra Fixa (Graviton)',
    muscleGroup: 'costas',
    equipment: 'maquina',
    instructions: ['Execute barras pull-up com os joelhos ou pés no apoio assistido.'],
  },
  {
    id: 'machine-shoulder-press',
    name: 'Desenvolvimento na Máquina',
    muscleGroup: 'ombros',
    equipment: 'maquina',
    instructions: ['Sente-se e empurre as alças da máquina para cima.'],
  },
  {
    id: 'cable-lateral-raise',
    name: 'Elevação Lateral no Cabo',
    muscleGroup: 'ombros',
    equipment: 'cabo',
    instructions: ['Com a polia baixa, levante o braço lateralmente.'],
  },
  {
    id: 'machine-lateral-raise',
    name: 'Elevação Lateral na Máquina',
    muscleGroup: 'ombros',
    equipment: 'maquina',
    instructions: ['Use as almofadas ou alças da máquina para elevar os braços lateralmente.'],
  },
  {
    id: 'reverse-cable-fly',
    name: 'Crucifixo Invertido no Cabo',
    muscleGroup: 'ombros',
    equipment: 'cabo',
    instructions: ['Puxe os cabos cruzados na altura dos ombros para trás.'],
  },
  {
    id: 'cable-external-shoulder-rotation',
    name: 'Rotação Externa no Cabo',
    muscleGroup: 'ombros',
    equipment: 'cabo',
    instructions: ['Mantendo o cotovelo fixo perto do corpo, gire o punho para fora.'],
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Supino Inclinado com Halteres',
    muscleGroup: 'peito',
    equipment: 'halteres',
    instructions: ['Deitado no banco inclinado, empurre os halteres para cima.'],
  },
  {
    id: 'incline-machine-chest-press',
    name: 'Supino Inclinado na Máquina',
    muscleGroup: 'peito',
    equipment: 'maquina',
    instructions: ['Empurre as alças da máquina inclinada para cima.'],
  },
  {
    id: 'machine-chest-press',
    name: 'Supino Reto na Máquina',
    muscleGroup: 'peito',
    equipment: 'maquina',
    instructions: ['Empurre as alças da máquina de peito para frente.'],
  },
  {
    id: 'machine-chest-fly',
    name: 'Voador (Peck Deck)',
    muscleGroup: 'peito',
    equipment: 'maquina',
    instructions: ['Sente-se na máquina e feche os braços contra as almofadas/alças.'],
  },
  {
    id: 'cable-incline-chest-fly',
    name: 'Crucifixo Inclinado no Cabo',
    muscleGroup: 'peito',
    equipment: 'cabo',
    instructions: ['No banco inclinado no meio do cross, feche os braços com cabos vindos de baixo.'],
  },
  {
    id: 'standing-cable-chest-fly',
    name: 'Crossover Polia Alta',
    muscleGroup: 'peito',
    equipment: 'cabo',
    instructions: ['Traga os cabos da polia alta até juntá-los abaixo do peito/quadril em pé.'],
  },
  {
    id: 'machine-bicep-curl',
    name: 'Rosca Bíceps na Máquina',
    muscleGroup: 'biceps',
    equipment: 'maquina',
    instructions: ['Curvar os braços usando as alças articuladas da máquina.'],
  },
  {
    id: 'cable-curl-bar',
    name: 'Rosca Direta no Cabo',
    muscleGroup: 'biceps',
    equipment: 'cabo',
    instructions: ['Levantar a barra puxando de uma polia baixa.'],
  },
  {
    id: 'incline-dumbbell-curl',
    name: 'Rosca Inclinada com Halteres',
    muscleGroup: 'biceps',
    equipment: 'halteres',
    instructions: ['Sentado no banco inclinado, com os braços pendurados para trás, dobre os cotovelos para elevar os halteres.'],
  },
  {
    id: 'tricep-pushdown-bar',
    name: 'Tríceps Pulldown com Barra Reta',
    muscleGroup: 'triceps',
    equipment: 'cabo',
    instructions: ['Puxe a barra reta para baixo usando a força do tríceps.'],
  },
  {
    id: 'overhead-cable-triceps-extension',
    name: 'Tríceps Francês no Cabo',
    muscleGroup: 'triceps',
    equipment: 'cabo',
    instructions: ['Com a polia baixa ou ajustável atrás do corpo, estenda o braço sobre a cabeça.'],
  },
  {
    id: 'standing-glute-kickback',
    name: 'Glúteo Máquina em Pé',
    muscleGroup: 'gluteos',
    equipment: 'maquina',
    instructions: ['De pé, empurre a plataforma para trás usando o glúteo.'],
  }
]

// Função para buscar exercício por ID
export function getExerciseById(id: string): Exercise | undefined {
  return exercises.find(ex => ex.id === id)
}

// Função para filtrar exercícios por grupo muscular
export function getExercisesByMuscleGroup(muscleGroup: string): Exercise[] {
  return exercises.filter(ex => ex.muscleGroup === muscleGroup)
}

// Função para buscar exercícios por nome
export function searchExercises(query: string): Exercise[] {
  const lowerQuery = query.toLowerCase()
  return exercises.filter(ex => 
    ex.name.toLowerCase().includes(lowerQuery) ||
    ex.muscleGroup.toLowerCase().includes(lowerQuery)
  )
}
