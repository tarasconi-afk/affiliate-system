export const SITE = {
  name: 'Ferramenta Clara',
  tagline: 'Dados claros para escolher melhor.',
  description: 'Comparações e guias de ferramentas baseados em especificações verificáveis e fontes abertas.',
  url: 'https://ferramentaclara.com.br',
  prelaunch: false,
  // AMAZON_MOP_SPRINT_V1: gate de monetizacao. false por padrao -- mudar isto
  // exige commit + review + push + deploy explicitos (mesmo rigor de qualquer
  // outra mudanca de codigo), nunca um toggle de runtime/env que possa ser
  // ligado sem querer. PageSpecs podem conter monetization.* mesmo com este
  // gate false; nada renderiza publicamente ate aqui virar true.
  monetizationEnabled: false,
} as const;
