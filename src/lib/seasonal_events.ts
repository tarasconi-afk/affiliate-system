// AMAZON_MOP_SPRINT_V1: representacao estruturada minima de eventos sazonais.
// Sinaliza PRIORIDADE (ex.: para ordenar quais candidates/paginas preparar
// primeiro), nunca muda validade editorial nem e interpolado em texto de
// conteudo diretamente -- isso evitaria precisar de um deploy so para tirar
// uma frase promocional vencida. Quando o evento termina, o CTA afiliado
// normal continua funcionando sem nenhuma mudanca de codigo.
export interface SeasonalEvent {
  id: string;
  market: string;
  startsAt: string;
  endsAt: string;
  status: 'UPCOMING' | 'ACTIVE' | 'ENDED';
  preparedFromVerifiedSource: boolean;
  sourceNote: string;
}

const now = () => new Date();

const RAW_EVENTS: Omit<SeasonalEvent, 'status'>[] = [
  {
    id: 'AMAZON_PRIME_EVENT_2026_10',
    market: 'BR',
    startsAt: '2026-10-06T00:00:00-03:00',
    endsAt: '2026-10-07T23:59:59-03:00',
    preparedFromVerifiedSource: true,
    sourceNote: 'Mega Oferta Amazon Prime BR, 06-07/10/2026 (anuncio publico do Seller Central); comissao padrao Ferramentas/Construcao 8% e recompensa Prime R$9 sao regras publicas atuais do Programa de Associados, nao uma comissao promocional especial comprovada para este evento especifico.',
  },
];

export function getSeasonalEventStatus(ev: Omit<SeasonalEvent, 'status'>, at: Date = now()): SeasonalEvent['status'] {
  const start = new Date(ev.startsAt).getTime();
  const end = new Date(ev.endsAt).getTime();
  const t = at.getTime();
  if (t < start) return 'UPCOMING';
  if (t > end) return 'ENDED';
  return 'ACTIVE';
}

export const SEASONAL_EVENTS: SeasonalEvent[] = RAW_EVENTS.map((ev) => ({ ...ev, status: getSeasonalEventStatus(ev) }));
