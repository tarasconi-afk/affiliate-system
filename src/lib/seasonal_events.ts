// AMAZON_MOP_SPRINT_V1: representacao estruturada minima de eventos sazonais.
// Sinaliza PRIORIDADE (ex.: para ordenar quais candidates/paginas preparar
// primeiro), nunca muda validade editorial nem e interpolado em texto de
// conteudo diretamente -- isso evitaria precisar de um deploy so para tirar
// uma frase promocional vencida. Quando o evento termina, o CTA afiliado
// normal continua funcionando sem nenhuma mudanca de codigo.
//
// MULTI_SOURCE_WINDOW_V1: fontes diferentes da propria Amazon declaram janelas
// diferentes para o mesmo evento (Seller Central: 6-7/10; comunicacao
// Creator/Associados: 5-11/10; landing page comercial: 5/10-12/10). Isto NAO e
// resolvido escolhendo uma data "oficial" arbitrariamente -- cada fonte fica
// registrada separadamente com sua propria evidencia. Nenhuma dessas datas e
// publicada como claim no conteudo evergreen do site.
export interface SeasonalWindowSource {
  sourceName: string;
  sourceKind: 'SELLER_CENTRAL' | 'CREATOR_ASSOCIATES_COMMS' | 'COMMERCIAL_LANDING_PAGE';
  startsAt: string;
  endsAt: string;
  observedBy: 'HUMAN' | 'AGENT';
  observedAt: string;
  note: string;
}

export interface SeasonalEvent {
  id: string;
  market: string;
  windows: SeasonalWindowSource[];
  status: 'UPCOMING' | 'ACTIVE' | 'ENDED' | 'MIXED_SOURCES';
  preparedFromVerifiedSource: boolean;
  sourceNote: string;
  // Link oficial SiteStripe da landing page da campanha (gerado pelo humano com
  // AMAZON_ASSOCIATE_ID=ferramentaclara-20), tratado como categoria PROPRIA --
  // nunca combinado com product affiliate links nem com o CTA de Prime signup.
  seasonalLandingLink: string | null;
}

const now = () => new Date();

function computeWindowStatus(windows: SeasonalWindowSource[], at: Date = now()): SeasonalEvent['status'] {
  const t = at.getTime();
  const starts = windows.map((w) => new Date(w.startsAt).getTime());
  const ends = windows.map((w) => new Date(w.endsAt).getTime());
  const earliestStart = Math.min(...starts);
  const latestEnd = Math.max(...ends);
  if (t < earliestStart) return 'UPCOMING';
  if (t > latestEnd) return 'ENDED';
  // dentro do intervalo de pelo menos uma fonte mas as fontes divergem -> MIXED_SOURCES
  const allAgree = starts.every((s) => s === starts[0]) && ends.every((e) => e === ends[0]);
  if (!allAgree) return 'MIXED_SOURCES';
  return 'ACTIVE';
}

const RAW_EVENTS: Omit<SeasonalEvent, 'status'>[] = [
  {
    id: 'AMAZON_PRIME_EVENT_2026_10',
    market: 'BR',
    windows: [
      {
        sourceName: 'Seller Central (forum de vendedores)',
        sourceKind: 'SELLER_CENTRAL',
        startsAt: '2026-10-06T00:00:00-03:00',
        endsAt: '2026-10-07T23:59:59-03:00',
        observedBy: 'AGENT',
        observedAt: '2026-10-05T18:00:00-03:00',
        note: 'Anuncio publico no forum de vendedores Amazon BR.',
      },
      {
        sourceName: 'Creator University (comunicacao para Associados)',
        sourceKind: 'CREATOR_ASSOCIATES_COMMS',
        startsAt: '2026-10-05T00:00:00-03:00',
        endsAt: '2026-10-11T23:59:59-03:00',
        observedBy: 'HUMAN',
        observedAt: '2026-10-05T19:00:00-03:00',
        note: 'Secao "Durante" do Creator University; instrucao explicita "No dia 5 de outubro, comece a compartilhar as ofertas a meia-noite".',
      },
      {
        sourceName: 'Landing page comercial ("Ate 80% off")',
        sourceKind: 'COMMERCIAL_LANDING_PAGE',
        startsAt: '2026-10-05T00:00:00-03:00',
        endsAt: '2026-10-12T23:59:59-03:00',
        observedBy: 'HUMAN',
        observedAt: '2026-10-05T19:00:00-03:00',
        note: 'Landing page comercial aberta pelo usuario, texto da propria pagina indicando periodo 05/10 a 12/10.',
      },
    ],
    preparedFromVerifiedSource: true,
    sourceNote: 'Tres fontes da propria Amazon divergem sobre a janela exata do evento (6-7/10 vs 5-11/10 vs 5/10-12/10). Nao escolhemos uma como "a data oficial" -- todas ficam registradas com sua propria evidencia. Comissao padrao Ferramentas/Construcao 8% e recompensa Prime R$9 sao regras publicas gerais do Programa de Associados, nao uma comissao promocional especial comprovada para este evento.',
    seasonalLandingLink: 'https://link.amazon/B09rgamjx',
  },
];

export const SEASONAL_EVENTS: SeasonalEvent[] = RAW_EVENTS.map((ev) => ({ ...ev, status: computeWindowStatus(ev.windows) }));

// SEASONAL_RUNTIME_EXPIRY_V1: a janela "oficial" nao existe (3 fontes
// divergem -- ver MULTI_SOURCE_WINDOW_V1 acima). getDisplayWindow() devolve o
// ENVELOPE MAIS LARGO que cobre todas as fontes (inicio mais cedo, fim mais
// tarde) -- nunca apresentado como "a data oficial", apenas usado para decidir
// quando o elemento deve aparecer/desaparecer no NAVEGADOR DO LEITOR, nao no
// momento do build. `status` acima continua existindo só para fins de
// prioridade/ordenação interna; a visibilidade real do CTA sazonal nunca mais
// depende dele.
export function getDisplayWindow(ev: SeasonalEvent): { startsAt: string; endsAt: string } {
  const starts = ev.windows.map((w) => new Date(w.startsAt).getTime());
  const ends = ev.windows.map((w) => new Date(w.endsAt).getTime());
  return { startsAt: new Date(Math.min(...starts)).toISOString(), endsAt: new Date(Math.max(...ends)).toISOString() };
}
