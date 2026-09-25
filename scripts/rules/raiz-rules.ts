// scripts/rules/raiz-rules.ts
//
// Regras para decidir a RAIZ e a SUBCATEGORIA correta de cada produto.
// Ordem importa: a primeira regra que bater ganha.
//
// ─── PRINCÍPIOS ──────────────────────────────────────────────
// 1. A MARCA não define a raiz sozinha. A keyword do produto decide.
// 2. PULSO, PUNHO, GRAMPOS são BDSM (definição do negócio).
//    ARMONY - GRAMPOS MAGNÉTICOS DE MAMILOS → BDSM.
// 3. Exceção: se a marca é BRINQUEDO e o título tem keyword de
//    brinquedo FORTE (WATCHME, VIBRADOR, CONTROLE REMOTO, etc.),
//    a keyword de brinquedo ganha. Ex.: ANBIGUO - WATCHME PLUG
//    PULSO → vibradores (mesmo tendo PULSO, que é BDSM).
// 4. Marca BDSM + produto brinquedo → brinquedos (keyword ganha).
// 5. Marca BDSM sem keyword reconhecida → null (NÃO MEXER).
// 6. Plug com controlo remoto/watchme/vibrador → vibradores.
// 7. Marcas mistas (OHMAMA, BIJOUX INDISCRETS, TOYJOY, SECRET PLAY,
//    SECRETPLAY, HIDDEN DESIRE) NÃO estão em listas de marca —
//    são classificadas por keyword do nome.
// ─────────────────────────────────────────────────────────────

export const ROOTS = {
  BRINQUEDOS: "brinquedos",
  SAUDE: "saude-e-bem-estar",
  BDSM: "fetiche-bdsm",
  LING_F: "lingerie-feminina",
  LING_M: "lingerie-masculina",
  JOGOS: "jogos-e-diversao",
} as const;

export const SUBS = {
  // Brinquedos
  ANEIS_PENIS: "aneis-para-o-penis",
  BOMBAS_PENIS: "bombas-para-o-penis",
  BOMBAS_VAGINAIS: "bombas-vaginais",
  BRINQUEDOS_ANAIS: "brinquedos-anais",
  DILDOS: "dildos",
  ESTIM_PROSTATA: "estimuladores-da-prostata",
  ESTIM_VAG_CLIT: "estimuladores-vaginais-e-clitorianos",
  INSUFLAVEIS: "insuflaveis",
  MASTURBADORES: "masturbadores-masculinos",
  OVOS_E_BALAS: "ovos-e-balas-vibratorias",
  STRAP_ONS: "strap-ons",
  VIBRADORES: "vibradores",

  // Saúde
  AFRODISIACOS: "afrodisiacos",
  INTENSIFICADORES: "intensificadores-de-orgasmo",
  DESENV_PENIANO: "desenvolvimento-peniano",
  LOCOES_CORPORAIS: "locoes-corporais",
  HIGIENE_INTIMA: "higiene-intima",
  LUBRIFICANTES: "lubrificantes",
  OLEOS_CREME_VELAS: "oleos-cremes-e-velas-de-massagem",
  PERFUMES: "perfumes",
  PRAZER_ORAL: "prazer-oral",
  PRESERVATIVOS: "preservativos",
  RELAXANTES: "relaxantes-e-anestesiantes",
  RETARDANTES: "retardantes",
  VOLUMIZADORES: "volumizadores-de-esperma",

  // BDSM
  ALGEMAS: "algemas-cordas-e-restricoes",
  VENDAS_MASCARAS_MORDACAS: "vendas-mascaras-e-mordacas",
  CHICOTES_PADDLES_PLUMAS: "chicotes-paddles-e-plumas",
  COLEIRAS_TRELAS_PINCAS: "coleiras-trelas-e-pincas",
  KITS_BDSM: "kits-bdsm",

  // Lingerie Feminina
  CONJUNTOS: "conjuntos",
  BODYS: "bodys",
  BABYDOLLS: "babydolls",
  CAMISAS_VESTIDOS: "camisas-de-noite-e-vestidos",
  CATSUITS: "catsuits-e-bodystockings",
  CUECAS_F: "cuecas",
  MEIAS_LIGAS: "meias-e-ligas",

  // Lingerie Masculina
  BOXERS_SLIPS: "boxers-slips-tangas-e-strings",
  JOCKSTRAPS: "jockstraps",
  BODYS_SENSUAIS: "bodys-e-pecas-sensuais",
  ARNESES_ACESSORIOS: "arneses-e-acessorios",
  FANTASIAS_M: "fantasias",

  // Jogos
  JOGOS_EROTICOS: "jogos-eroticos",
  COMESTIVEIS: "comestiveis",
  AVENTAIS: "aventais-e-artigos-divertidos",
  PINTURA_CORPORAL: "pintura-corporal",
  BONECAS_INSUFLAVEIS: "bonecas-e-insuflaveis",
} as const;

export interface Match {
  root: string;
  sub?: string;
  reason: string;
}

// ═══════════════════════════════════════════════════════════════
// MARCAS
// ═══════════════════════════════════════════════════════════════

const BRANDS_LING_F = [
  "CHILIROSE", "PASSION", "SUBBLIME", "ME-SEDUCE", "LEG AVENUE",
  "LIVCO CORSETTI FASHION", "CASMIR", "PENTHOUSE", "OBSESSIVE",
  "OLIDELIA", "LE FRIVOLE", "INSPIRE", "MOONLIGHT", "HOTFLOWERS",
];

const BRANDS_LING_M = [
  "MACHO", "ANAIS MEN", "BURN", "LOCKER GEAR", "CUT4MEN", "MOB",
];

const BRANDS_BDSM = [
  "DARKNESS", "KINK", "FETISH FANTASY", "FETISH FANTASY SERIES",
  "FETISH FANTASY GOLD", "FETISH FANTASY ELITE",
  "FETISH FANTASY ELITE COLLECTION", "FETISH FANTASY EXTREME",
  "FETISH FANTASY LIMITED EDITION", "FETISH FANTASY EDIÇÃO LIMITADA",
  "FETISH SUBMISSIVE", "FETISH SUBMISSIVE ATTITUDE",
  "FETISH SUBMISSIVE BONDAGE", "FETISH SUBMISSIVE DARK ROOM",
  "FETISH SUBMISSIVE ORIGIN", "BEGME", "COQUETTE CHIC DESIRE",
  "METAL HARD", "INTENSE", "TOYJOY", "ANNE'S DESIRE",
];

const BRANDS_JOGOS = [
  "KHEPER GAMES", "JOGOS KHEPER", "ARIA", "DIABLO PICANTE",
  "DIABO PICANTE", "DIABLO GOLOSO", "CONDOMERIE", "PRIDE",
  "PLAY WIV ME", "INEDIT", "FIERCE GAME",
];

const BRANDS_SAUDE = [
  "500 COSMETICS", "BLACK BULL", "MEDICA GROUP", "XPOWER",
  "WUG", "WUG SEX SENSE", "COBECO", "COBECO - BIO",
  "COBECO - CBL", "COBECO - COOLMAN", "COBECO - FIST ASSIST",
  "PJUR", "SHUNGA", "EROS", "HOT", "RUF", "JOYDIVISION",
  "INTIMATELINE", "INTIMATELINE LUXURIA", "EURO1SEX",
  "PHEROSTRONG", "ANDROPHARMA", "TENTACION",
  "DUREX", "CONTROL", "SKYN", "PASANTE", "MISTER SIZE",
  "UNIQ", "MY SIZE", "BEPPY", "CONFORTEX", "EUROGLIDER",
  "EXS CONDOMS", "LOOVARA", "SKINS",
  // Novas marcas saúde identificadas
  "AMOREANE", "AQUA QUALITY", "AQUA TRAVEL", "BIOAQUA",
  "BLACK HOLE", "BODY IN BALANCE", "BRUMA", "CREAMY", "EXCITE",
  "EXTASE SENSUAL", "EYE OF LOVE", "FEMINTIMATE", "FISTAN",
  "HEROS", "ID FREE", "ID FRUTOPIA", "ID GLIDE", "ID JELLY",
  "ID JUICY LUBE", "ID MILLENIUM", "ID PLEASURE", "ID SENSATION",
  "ID SILK", "ID STIMULATION GEL FOR HER", "ID VELVET", "ID XTREME",
  "INTT", "INVERMA", "JES-EXTENDER", "ANDROEXTENDER", "ANDROPENIS",
  "ANDROPEYRONIE", "KAMASUTRA", "KIKÍ TRAVEL", "LUBRANAL",
  "MARAL GEL", "MIXGLISS", "NINA KIKÍ", "ORGIE", "SHEER GLYDE",
  "SOFT AND TENDER", "SPARTAN", "STERCUP", "STIMUL8", "SWEDE",
  "TALOKA", "TITAN GEL", "TAURO", "UNILATEX", "WATERFEEL",
  "X POWER", "LUI",
];

const BRANDS_BRINQUEDOS = [
  "ADDICTED TOYS", "ADDICTED TOYS LOCKED", "ADRIEN LASTIC",
  "ALIVE", "ALL BLACK", "ANBIGUO", "ARMONY", "B SWISH",
  "BAILE", "BASECOCK", "BATHMATE", "CALEXOTICS", "CLIMAXIMUM",
  "COCK MILLER", "CYBER SILICOCK", "DILLIO", "DIVERSIA",
  "DOLCE VITA", "DREAMLOVE", "ELECTRASTIM", "EPIC", "ÉPIC",
  "ÉPICO", "EXTREME TOYZ", "FANTASY FOR HER", "FLESHLIGHT",
  "FLESHJACK", "FUN FACTORY", "G-VIBE", "GALATEA", "GET REAL",
  "GLOSSY", "HAPPY LOKY", "HERSPOT", "HERSPOT FLESHLIGHT",
  "JAMYJOB", "JE JOUE", "KIIROO", "KING COCK", "LELO",
  "LIONA BY MOMA", "LOVECLONE", "MIA", "MOB", "MORESSA",
  "MR BOSS", "MR INTENSE", "MR PLAY", "MYTHOLOGY", "NALONE",
  "NIYA", "ONINDER", "PDX ELITE", "PDX EXTREME", "PDX PLUS",
  "PIPEDREAM", "PIPEDREAMS", "POWER MONSTERS", "PRETTY LOVE",
  "PUMP ADDICTED", "PUMP WORX", "ROCKS-OFF", "ROCKARMY",
  "ROMP", "SATISFYER", "SEVEN CREATIONS", "SHEQU", "SILEXD",
  "SNAIL VIBE", "TENGA", "TREASURE", "VIRILXL", "WANACHI",
  "WE-VIBE", "WEARWATCH", "WATCHME", "WOMANIZER", "WOMANVIBE",
  "XISE", "XOCOON", "ZALO", "COVERME", "BRILLY GLAM",
  "BLACK&SILVER", "CRAZY BULL", "ANAL FANTASY",
  "ANAL FANTASY ELITE", "ANAL FANTASY ELITE COLLECTION",
  "CANECA DIABLO PICANTE",
  // Novas marcas brinquedos identificadas
  "ACT", "ARCWAVE", "BASIX", "BONITO AMOR", "CASUAL LOVE",
  "CICI BEAUTY", "CLONEBOY", "CUSTOM BULLETS", "DARKEST TEMPTATION",
  "DESEJO OCULTO", "EXTREME DOLLZ", "FANTASY C-RINGZ",
  "FANTASY X-TENSIONS", "FUN FUNCTION", "G-SPOT",
  "HARNESS ATTRACTION", "HIDDEN DESIRE", "HUNG SYSTEM", "ICICLES",
  "LEATHER BODY", "LIPS STYLE", "NEBULA SERIES BY IBIZA",
  "OHMIBOD", "OLIMPYA", "ONLINE", "PINK ROOM", "POWERING",
  "PRIVATE", "REAL FEEL DELUXE", "REWOLUTION", "RITHUAL",
  "ROMANCE", "SECRET DOME", "SHE.E.O", "X RAY",
  "MR. LIMPY", "MR. LIMPY FLESHLIGHT",
];

// ═══════════════════════════════════════════════════════════════
// KEYWORDS DE SAÚDE
// ═══════════════════════════════════════════════════════════════

const KEYWORDS_SAUDE = [
  "LUBRIFICANTE", "LUBE", "GEL LUBRIFICANTE", "GEL ÍNTIMO",
  "ÓLEO DE MASSAGEM", "OLEO DE MASSAGEM", "ÓLEO ÍNTIMO",
  "CREME DE MASSAGEM", "CREME ÍNTIMO", "VELA DE MASSAGEM",
  "LIMPADOR", "LIMPEZA", "HIGIENIZADOR", "TOY CLEANER",
  "PRESERVATIVO", "CAMISINHA", "CONDOM",
  "COPO MENSTRUAL", "TAMPÃO",
  "HIDRATANTE PESSOAL", "HIDRATANTE ÍNTIMO",
  "ESPUMA ABSORVENTE", "PÓ REFRESCANTE", "PÓ RENOVADOR",
];

// ═══════════════════════════════════════════════════════════════
// KEYWORDS BDSM
// ═══════════════════════════════════════════════════════════════
//
// PULSO, PUNHO, GRAMPOS são BDSM (definição do negócio).
// ARMONY - GRAMPOS MAGNÉTICOS DE MAMILOS → BDSM.
// A exceção só se aplica a keywords de brinquedo FORTES (abaixo).

const KEYWORDS_BDSM = [
  "ALGEMA", "ALGEMAS",
  "MORDAÇA", "MORDACA", "GAG",
  "BONDAGE", "FITA DE BONDAGE", "HOG TIE",
  "TORNOZELO",
  "CHICOTE", "FLOGGER", "PADDLE",
  "PINÇA", "PINCA", "CLAMP",
  "CLIPE", "CLIPES",
  "COLEIRA", "COLAR", "TRELA", "GARGANTILHA",
  "VENDA", "MÁSCARA", "MASCARA", "BLINDFOLD", "CAPUZ",
  "GAIOLA DE PÊNIS", "GAIOLA DE PENIS",
  "GAIOLA DE CASTIDADE", "CINTO DE CASTIDADE",
  "PULSO", "PUNHO", "GRAMPOS",
];

// ═══════════════════════════════════════════════════════════════
// KEYWORDS DE BRINQUEDO FORTES
// ═══════════════════════════════════════════════════════════════
//
// Só estas é que fazem a marca BRINQUEDO ganhar a uma keyword BDSM.
// Ex.: ANBIGUO - WATCHME PLUG PULSO → vibradores (tem WATCHME).
// ARMONY - GRAMPOS MAGNÉTICOS DE MAMILOS → BDSM (não tem nenhuma).

const KEYWORDS_BRINQUEDO_FORTES = [
  "WATCHME",
  "CONTROLE REMOTO",
  "VIBRADOR",
  "VIBE",
  "WAND",
  "MASSAGER",
  "SUCÇÃO",
  "SUCKER",
  "DILDO",
  "DONG",
  "MASTURBADOR",
  "STROKER",
  "BULLET",
  "OVO VIBR",
  "BALA VIBR",
  "STRAP-ON",
  "STRAP ON",
];

// ═══════════════════════════════════════════════════════════════
// MATCHERS
// ═══════════════════════════════════════════════════════════════

function startsWithBrand(name: string, brand: string): boolean {
  const n = name.toUpperCase();
  const b = brand.toUpperCase();
  return n === b || n.startsWith(b + " ") || n.startsWith(b + " -") || n.startsWith(b + "-");
}

function includesAny(
  name: string,
  keywords: string[],
  strict = false
): string | null {
  const n = name.toUpperCase();
  for (const kw of keywords) {
    if (strict) {
      const re = new RegExp(`\\b${kw}\\b`, "i");
      if (re.test(n)) return kw;
    } else {
      if (n.includes(kw.toUpperCase())) return kw;
    }
  }
  return null;
}

function includesAnyBdsm(name: string): string | null {
  return includesAny(name, KEYWORDS_BDSM, false);
}

function includesAnyBrinquedoForte(name: string): string | null {
  return includesAny(name, KEYWORDS_BRINQUEDO_FORTES, false);
}

function hasBrand(name: string, brands: string[]): string | null {
  for (const b of brands) {
    if (startsWithBrand(name, b)) return b;
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════
// CLASSIFICAÇÃO PRINCIPAL
// ═══════════════════════════════════════════════════════════════
//
// ORDEM (a primeira que bate ganha):
//  1. Marca BRINQUEDO + keyword SAÚDE              → saúde
//  2. Marca BRINQUEDO + keyword BRINQUEDO FORTE    → brinquedos
//     (ex.: ANBIGUO - WATCHME PLUG PULSO → vibradores)
//  3. Marca BRINQUEDO + keyword BDSM               → BDSM
//     (ex.: ARMONY - GRAMPOS MAGNÉTICOS DE MAMILOS → BDSM)
//     (ex.: ADDICTED TOYS LOCKED - GAIOLA DE PÊNIS → BDSM)
//  4. Marca BDSM      + keyword BRINQUEDO          → brinquedos
//     (ex.: DARKNESS - CANETA ESTIMULANTE → estimuladores)
//  5. Marca BDSM      + keyword BDSM               → BDSM
//  6. Marca BDSM sem keyword reconhecida           → null (NÃO MEXER)
//  7. Marca LING_F / LING_M / JOGOS / SAÚDE / BRINQUEDO
//  8. Sem marca                                    → null

export function classify(name: string): Match | null {
  const brandToy = hasBrand(name, BRANDS_BRINQUEDOS);
  const brandBdsm = hasBrand(name, BRANDS_BDSM);
  const brandLF = hasBrand(name, BRANDS_LING_F);
  const brandLM = hasBrand(name, BRANDS_LING_M);
  const brandJogos = hasBrand(name, BRANDS_JOGOS);
  const brandSaude = hasBrand(name, BRANDS_SAUDE);

  const kwBdsm = includesAnyBdsm(name);
  const kwToyForte = includesAnyBrinquedoForte(name);

  // 1. Marca BRINQUEDO + keyword SAÚDE → saúde
  if (brandToy) {
    const kwSaude = includesAny(name, KEYWORDS_SAUDE, false);
    if (kwSaude) {
      return {
        root: ROOTS.SAUDE,
        sub: subSaudeByKeyword(name),
        reason: `${brandToy} + "${kwSaude}" → saúde`,
      };
    }
  }

  // 2. Marca BRINQUEDO + keyword BRINQUEDO FORTE → brinquedos
  //    Só aqui a marca brinquedo ganha à keyword BDSM.
  //    Ex.: ANBIGUO - WATCHME PLUG PULSO → vibradores.
  if (brandToy && kwToyForte) {
    return {
      root: ROOTS.BRINQUEDOS,
      sub: subBrinquedosByKeyword(name),
      reason: `${brandToy} + "${kwToyForte}" → brinquedos`,
    };
  }

  // 3. Marca BRINQUEDO + keyword BDSM → BDSM
  //    ARMONY - GRAMPOS MAGNÉTICOS DE MAMILOS → BDSM
  //    ADDICTED TOYS LOCKED - GAIOLA DE PÊNIS → BDSM
  if (brandToy && kwBdsm) {
    return {
      root: ROOTS.BDSM,
      sub: subBdsmByKeyword(name),
      reason: `${brandToy} + "${kwBdsm}" → BDSM`,
    };
  }

  // 4. Marca BDSM + keyword BRINQUEDO FORTE → brinquedos
  //    Ex.: DARKNESS - CANETA ESTIMULANTE → estimuladores
  if (brandBdsm && kwToyForte) {
    return {
      root: ROOTS.BRINQUEDOS,
      sub: subBrinquedosByKeyword(name),
      reason: `${brandBdsm} + "${kwToyForte}" → brinquedos`,
    };
  }

  // 4b. Marca BDSM + keyword brinquedo (via subBrinquedosByKeyword)
  //     Ex.: COQUETTE CHIC DESIRE - COCK RING → aneis-para-o-penis
  if (brandBdsm) {
    const subToy = subBrinquedosByKeyword(name);
    if (subToy) {
      return {
        root: ROOTS.BRINQUEDOS,
        sub: subToy,
        reason: `${brandBdsm} + keyword brinquedo → brinquedos > ${subToy}`,
      };
    }
  }

  // 5. Marca BDSM + keyword BDSM → BDSM
  if (brandBdsm && kwBdsm) {
    return {
      root: ROOTS.BDSM,
      sub: subBdsmByKeyword(name),
      reason: `${brandBdsm} + "${kwBdsm}" → BDSM`,
    };
  }

  // 6. Marca BDSM sem keyword reconhecida → NÃO MEXER
  if (brandBdsm) {
    return null;
  }

  // 7. Outras marcas
  if (brandLF) {
    return {
      root: ROOTS.LING_F,
      sub: subLingFByKeyword(name),
      reason: `marca lingerie fem ${brandLF}`,
    };
  }
  if (brandLM) {
    return {
      root: ROOTS.LING_M,
      sub: subLingMByKeyword(name),
      reason: `marca lingerie masc ${brandLM}`,
    };
  }
  if (brandJogos) {
    return {
      root: ROOTS.JOGOS,
      sub: subJogosByKeyword(name),
      reason: `marca jogos ${brandJogos}`,
    };
  }
  if (brandSaude) {
    return {
      root: ROOTS.SAUDE,
      sub: subSaudeByKeyword(name),
      reason: `marca saúde ${brandSaude}`,
    };
  }
  if (brandToy) {
    return {
      root: ROOTS.BRINQUEDOS,
      sub: subBrinquedosByKeyword(name),
      reason: `marca brinquedo ${brandToy}`,
    };
  }

  // 8. Sem marca reconhecida → não mexer
  return null;
}

// ═══════════════════════════════════════════════════════════════
// SUBCATEGORIA POR KEYWORD
// ═══════════════════════════════════════════════════════════════

function subSaudeByKeyword(name: string): string | undefined {
  const n = name.toUpperCase();

  if (/PERFUME|FEROMON|PHIERO|PHEROM|MULHER DA NOITE|AMBIENTADOR/.test(n))
    return SUBS.PERFUMES;
  if (/PÊNIS|PENIS|U-MAN|SIZEGAIN|U-VOLUME|ESPERMA|VIRILIDADE|EREC[ÇC]|ERETIL|PENILARGE|U-VIRILITY|PROVIRILIA/.test(n))
    return SUBS.DESENV_PENIANO;
  if (/RETARD|DELAY|ATRASO|DURA MAIS|PROLONG|MAX PAUSE|STAY UP/.test(n))
    return SUBS.RETARDANTES;
  if (/VOLUME 500|CUM PLUS|AUMENTAR A QUANTIDADE E QUALIDADE DO ESPERM/.test(n))
    return SUBS.VOLUMIZADORES;
  if (/RELAX ANAL|ANAL RELAX|RELAXANTE ANAL|ANESTES|EASE SPRAY/.test(n))
    return SUBS.RELAXANTES;
  if (/CREME ESTIMULANTE|GEL ESTIMULANTE|B[ÁA]LSAMO ESTIMULANTE|ORGASM|CLITÓRIS/.test(n))
    return SUBS.INTENSIFICADORES;
  if (/PASTA DE DENTES|SPRAY ORAL|SEXO ORAL|GARGANTA/.test(n))
    return SUBS.PRAZER_ORAL;
  if (/PRESERVATIVO|CAMISINHA|CONDOM/.test(n))
    return SUBS.PRESERVATIVOS;
  if (/LIMPADOR|LIMPEZA|HIGIENIZADOR|TOY CLEANER|WIPES|SABONETE ÍNTIMO|FRESH WIPES|COPO MENSTRUAL|TAMPÃO/.test(n))
    return SUBS.HIGIENE_INTIMA;
  if (/LUBRIFICANTE|LUBE|GEL LUBRIFICANTE|GEL ÍNTIMO|GEL ANAL|GEL BASE|ANAL LUBE|BODYGLIDE|SILICONE/.test(n))
    return SUBS.LUBRIFICANTES;
  if (/ÓLEO DE MASSAGEM|OLEO DE MASSAGEM|CREME DE MASSAGEM|VELA DE MASSAGEM|GEL DE MASSAGEM|ÓLEO ÍNTIMO|OLEO INTIMO/.test(n))
    return SUBS.OLEOS_CREME_VELAS;
  if (/LO[ÇC][ÃA]O|CREME PARA C[ÁA]NCER|CREME REAFIRM|CREME FIRMADOR|CREME CLAREADOR|U-BREAST|PROCURVES|BUSTO/.test(n))
    return SUBS.LOCOES_CORPORAIS;
  if (/C[ÁA]PSULA|COMPRIMIDO|PILLS|GOTAS|AMPOOLA|SUPLEMENTO/.test(n))
    return SUBS.AFRODISIACOS;

  return undefined;
}

function subBdsmByKeyword(name: string): string | undefined {
  const n = name.toUpperCase();

  // GAIOLA DE PÊNIS / CASTIDADE → algemas-cordas-e-restricoes
  if (/GAIOLA DE P[ÊE]NIS|GAIOLA DE PENIS|GAIOLA DE CASTIDADE|CASTIDADE|CINTO DE CASTIDADE|CAGE|CHASTITY/.test(n))
    return SUBS.ALGEMAS;

  if (/CHICOTE|FLOGGER|PADDLE|P[ÁA] DE CABO|P[ÁA] DE|CROP|REMOS/.test(n))
    return SUBS.CHICOTES_PADDLES_PLUMAS;
  if (/MORDA[ÇC]A|MORDACA|GAG|BOLA RESPIR|MORDAÇA DE BOLA/.test(n))
    return SUBS.VENDAS_MASCARAS_MORDACAS;
  if (/VENDA|M[ÁA]SCARA|MASCARA|BLINDFOLD|CAPUZ|SUBMISS/.test(n))
    return SUBS.VENDAS_MASCARAS_MORDACAS;
  if (/PIN[ÇC]A|PINCA|CLAMP|BICO|CLIPE|CLIPES|GRAMPOS|MAMILO|NIPPLE/.test(n))
    return SUBS.COLEIRAS_TRELAS_PINCAS;
  if (/COLEIRA|COLAR|TRELA|GARGANTILHA/.test(n))
    return SUBS.COLEIRAS_TRELAS_PINCAS;
  if (/ALGEMA|PUNHO|PUNHOS|PULSO|TORNOZELO|RESTRI[ÇC][ÃA]O|RESTRICAO|BONDAGE|CORDA|FITA|SPREADER|BARRA|HOG TIE/.test(n))
    return SUBS.ALGEMAS;
  if (/KIT/.test(n))
    return SUBS.KITS_BDSM;

  return undefined;
}

function subLingFByKeyword(name: string): string | undefined {
  const n = name.toUpperCase();

  if (/BODYSTOCK|CATSUIT/.test(n)) return SUBS.CATSUITS;
  if (/BABYDOLL/.test(n)) return SUBS.BABYDOLLS;
  if (/CHEMISE|VESTIDO|CAMISA DE NOITE|PEIGNOIR/.test(n)) return SUBS.CAMISAS_VESTIDOS;
  if (/MEIA|LIGA/.test(n)) return SUBS.MEIAS_LIGAS;
  if (/TANGA|CALCINHA|CUE[CA]|FIO DENTAL/.test(n)) return SUBS.CUECAS_F;
  if (/BODY|BODYSUIT|CORPO|TEDDY/.test(n)) return SUBS.BODYS;
  if (/CONJUNTO|SUTI[ÃA]|BIQU[ÍI]NI/.test(n)) return SUBS.CONJUNTOS;

  return SUBS.CONJUNTOS;
}

function subLingMByKeyword(name: string): string | undefined {
  const n = name.toUpperCase();

  if (/JOCK/.test(n)) return SUBS.JOCKSTRAPS;
  if (/BOXER|SLIP|TANGA|STRING/.test(n)) return SUBS.BOXERS_SLIPS;
  if (/ARN[ÊE]S|HARNESS|CINTO|ARREIO/.test(n)) return SUBS.ARNESES_ACESSORIOS;
  if (/MEIA/.test(n)) return SUBS.ARNESES_ACESSORIOS;
  if (/T-SHIRT|CAMISETA|TOP|BODY/.test(n)) return SUBS.BODYS_SENSUAIS;
  if (/FANTASIA/.test(n)) return SUBS.FANTASIAS_M;

  return SUBS.BODYS_SENSUAIS;
}

function subJogosByKeyword(name: string): string | undefined {
  const n = name.toUpperCase();

  if (/DOCE|PIRULITO|GOMA|CHICLETE|BALA|BOLO|BISCOITO|COMEST/.test(n))
    return SUBS.COMESTIVEIS;
  if (/JOGO|DADOS|DADO|ROLETA|BARALHO|KAMASUTRA|CARTAS/.test(n))
    return SUBS.JOGOS_EROTICOS;
  if (/PINTURA|TINTA CORPORAL|BODYPAINT/.test(n))
    return SUBS.PINTURA_CORPORAL;
  if (/BONECA|INFL[ÁA]VEL/.test(n))
    return SUBS.BONECAS_INSUFLAVEIS;
  if (/VELA/.test(n))
    return SUBS.AVENTAIS;
  if (/CANECA|CHAVEIRO|ABRIDOR|ÍM|IM |APITO|COPO|SABONETE|ESPONJA|L[ÁA]PIS|MOUSE PAD|ISQUEIRO|GARRAFA|COFRE|PORTA|ESPETO|POTE|CAIXA|VELA|DECANTADOR|TAMPA|CHUPETA|BAL[ÃA]O|TRIKINI|BANDEJA|ALMOFADA|FAIXA|CUECA|SAPATO|SINO|CANUDO|PALITO|RECIPIENTE|JARRO|JARRA|SHOT|COASTERS|PHOTOCALL/.test(n))
    return SUBS.AVENTAIS;

  return undefined;
}

function subBrinquedosByKeyword(name: string): string | undefined {
  const n = name.toUpperCase();

  // ─── 1. Plug com controlo remoto / watchme / vibrador → vibradores ───
  if (/CONTROLE REMOTO|WATCHME|VIBRADOR|VIBE/.test(n) && /PLUG/.test(n))
    return SUBS.VIBRADORES;

  // ─── 2. Anéis de pénis ───
  if (/ANEL|C-RING|COCKRING|COCK RING|AN[ÉE]IS|DUAL RING|TRIPLO.*ANEL/.test(n))
    return SUBS.ANEIS_PENIS;

  // ─── 3. Fisting / punho (NÃO é BDSM) ───
  if (/PUNHO ANAL|PUNHO FISTING|PUNHO GIGANTE|FISTING/.test(n))
    return SUBS.BRINQUEDOS_ANAIS;

  if (/BOMBA|PUMP|HYDROMAX|HYDROXTREME|PENIS PUMP/.test(n))
    return SUBS.BOMBAS_PENIS;
  if (/MASTURBADOR|STROKER|BATOR/.test(n))
    return SUBS.MASTURBADORES;
  if (/PLUG ANAL|PLUGUE ANAL|PLUGUE|DILATADOR ANAL|DILDO ANAL|BOLAS ANAIS|CONTAS ANAIS|DILDO.*FISTING/.test(n))
    return SUBS.BRINQUEDOS_ANAIS;
  if (/PRÓSTATA|PROSTATA|P-SPOT|P SPOT/.test(n))
    return SUBS.ESTIM_PROSTATA;
  if (/OVO VIBR|BALA VIBR|BULLET/.test(n))
    return SUBS.OVOS_E_BALAS;
  if (/STRAP-ON|STRAP ON|ARNÊS COM DILDO/.test(n))
    return SUBS.STRAP_ONS;
  if (/VIBRADOR|VIBE|MASSAGEADOR|MASSAGER|WAND|SUCÇÃO|SUCKER/.test(n))
    return SUBS.VIBRADORES;
  if (/ESTIMULADOR.*CLIT|CLITÓRIS|G-SPOT|PONTO G|SUC[ÇC][ÃA]O|COELHO|COELHINHO|RABBIT/.test(n))
    return SUBS.ESTIM_VAG_CLIT;
  if (/DILDO|DONG|PÊNIS REAL|PENIS REAL|TENTÁCULO|TENTACULO/.test(n))
    return SUBS.DILDOS;
  if (/INFL[ÁA]VEL/.test(n))
    return SUBS.INSUFLAVEIS;

  return undefined;
}