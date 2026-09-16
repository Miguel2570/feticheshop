// src/utils/product-normalizer.ts

/**
 * Normaliza nomes de produtos da Dreamlove de PT-BR/erros de acento
 * para PT-PT correto.
 *
 * ⚠️  Este módulo SÓ corrige palavras comuns. Não toca em:
 *   - Nomes de marcas (LOVENSE, SATISFYER, BAILE, etc.)
 *   - Nomes de linhas (FIRST TIME, MASSAGE TIME, XTRA TIME)
 *   - Palavras inglesas intencionais (LOVE, HARD, SOFT, PLAY, etc.)
 *   - Códigos de modelos (MX25NC, CR 4688, BWILD, etc.)
 *
 * O módulo corrige também "mojibake" (duplo encoding UTF-8) que veio
 * do import original da Dreamlove.
 */

// ═══════════════════════════════════════════════════════════════
// Termos protegidos — NUNCA são tocados pela normalização
// ═══════════════════════════════════════════════════════════════

const PROTECTED_TERMS = [
  // ── Marcas principais
  "LOVENSE", "SATISFYER", "BAILE", "CHILIROSE", "LEG AVENUE",
  "BIJOUX INDISCRETS", "PASSION", "SUBBLIME", "INTENSE", "KINK",
  "CALEXOTICS", "MACHO", "EROS", "PJUR", "SHUNGA", "SECRETPLAY",
  "SECRET PLAY", "ORGIE", "DIABLO PICANTE", "PHEROSTRONG",
  "WOMANIZER", "WEARWATCH", "B SWISH", "PUMP WORX", "ROCKS-OFF",
  "SILEXD", "JOYDIVISION", "LIVCO CORSETTI FASHION", "BYE-BRA",
  "ARMONY", "TENTACION", "ALIVE", "EXTREME TOYZ", "FETISH SUBMISSIVE",
  "DARK ROOM", "BURN", "ADRIEN LASTIC", "SPENCER & FLEETWOOD",
  "CLONEBOY", "MAGIC", "BRAVE", "SOUL", "CHILL", "POWER", "NAVAL",
  "FALCON", "MERCURY", "COMICS", "TRIBAL", "AEGIS", "SAVAGE",
  "BENITO", "BANANA", "BALANCE", "PETROL", "TOKIO", "ELECTRO",

  // ── Marcas adicionadas
  "PRETTY LOVE", "CRAZY BULL", "ANAL FANTASY", "LEATHER BODY",
  "SEVEN CREATIONS", "KIIROO", "FETISH FANTASY SERIES",
  "FETISH FANTASY", "LOVE EGGS", "BLACK", "FANTASY", "ELITE",
  "DARKNESS", "DESIRE", "OHMAMA", "ADDICTED", "LELO",
  "FLESHLIGHT", "PDX", "MOB", "AQUA",

  // ── Linhas / nomes de produtos
  "FIRST TIME", "MASSAGE TIME", "XTRA TIME", "TIME LAG",
];

// ═══════════════════════════════════════════════════════════════
// Fix de mojibake — duplo encoding UTF-8
// ═══════════════════════════════════════════════════════════════

/**
 * Corrige "mojibake" — caracteres acentuados que sofreram duplo
 * encoding UTF-8 no import original.
 *
 * Padrão: um caractere como "Í" (U+00CD) foi convertido em 2 chars:
 *   "Ã" (U+00C3) seguido de um control char U+0080-U+009F.
 */
function fixMojibake(name: string): string {
  return name
    .replace(/\u00C3\u0080/g, "À")
    .replace(/\u00C3\u0081/g, "Á")
    .replace(/\u00C3\u0082/g, "Â")
    .replace(/\u00C3\u0083/g, "Ã")
    .replace(/\u00C3\u0087/g, "Ç")
    .replace(/\u00C3\u0088/g, "È")
    .replace(/\u00C3\u0089/g, "É")
    .replace(/\u00C3\u008A/g, "Ê")
    .replace(/\u00C3\u008C/g, "Ì")
    .replace(/\u00C3\u008D/g, "Í")
    .replace(/\u00C3\u0092/g, "Ò")
    .replace(/\u00C3\u0093/g, "Ó")
    .replace(/\u00C3\u0094/g, "Ô")
    .replace(/\u00C3\u0095/g, "Õ")
    .replace(/\u00C3\u0099/g, "Ù")
    .replace(/\u00C3\u009A/g, "Ú");
}

// ═══════════════════════════════════════════════════════════════
// Mapa de correções PT-BR / PT-PT
//
// ⚠️  Usamos (?<![A-ZÀ-ÿ]) e (?![A-ZÀ-ÿ]) em vez de \b
//     porque \b em JavaScript não funciona corretamente
//     com caracteres acentuados fora da flag `u`.
// ═══════════════════════════════════════════════════════════════

const WB_START = "(?<![A-ZÀ-ÿ])"; // não precedido por letra
const WB_END = "(?![A-ZÀ-ÿ])";    // não seguido por letra

const PT_FIXES: Array<[RegExp, string]> = [
  // ═══════════════════════════════════════════════════════════════
  // 1. ERROS ESPECÍFICOS DO CATÁLOGO (Ã em vez de acento)
  // ═══════════════════════════════════════════════════════════════
  [new RegExp(`${WB_START}DÃSIR${WB_END}`, "gi"), "DÍSIR"],
  [new RegExp(`${WB_START}MÃTALLIQUE${WB_END}`, "gi"), "MÍTALLIQUE"],
  [new RegExp(`${WB_START}ÃNTIMO${WB_END}`, "gi"), "ÍNTIMO"],
  [new RegExp(`${WB_START}ÃNTIMA${WB_END}`, "gi"), "ÍNTIMA"],
  [new RegExp(`${WB_START}EDIÃO${WB_END}`, "gi"), "EDIÇÃO"],
  [new RegExp(`${WB_START}NÃVEL${WB_END}`, "gi"), "NÍVEL"],
  [new RegExp(`${WB_START}NÃVEIS${WB_END}`, "gi"), "NÍVEIS"],
  [new RegExp(`${WB_START}ÃGUA${WB_END}`, "gi"), "ÁGUA"],
  [new RegExp(`${WB_START}ÃGUAS${WB_END}`, "gi"), "ÁGUAS"],
  [new RegExp(`${WB_START}Ã BASE${WB_END}`, "gi"), "A BASE"],

  // ═══════════════════════════════════════════════════════════════
  // 2. Perda de ÃO/ÇÕES
  // ═══════════════════════════════════════════════════════════════
  [new RegExp(`${WB_START}VIBRAO${WB_END}`, "gi"), "VIBRAÇÃO"],
  [new RegExp(`${WB_START}VIBRAES${WB_END}`, "gi"), "VIBRAÇÕES"],
  [new RegExp(`${WB_START}CORAO${WB_END}`, "gi"), "CORAÇÃO"],
  [new RegExp(`${WB_START}ROTAO${WB_END}`, "gi"), "ROTAÇÃO"],
  [new RegExp(`${WB_START}ESTIMULAO${WB_END}`, "gi"), "ESTIMULAÇÃO"],
  [new RegExp(`${WB_START}PENETRAO${WB_END}`, "gi"), "PENETRAÇÃO"],
  [new RegExp(`${WB_START}GERAO${WB_END}`, "gi"), "GERAÇÃO"],
  [new RegExp(`${WB_START}TENTAO${WB_END}`, "gi"), "TENTAÇÃO"],
  [new RegExp(`${WB_START}ATRAO${WB_END}`, "gi"), "ATRAÇÃO"],
  [new RegExp(`${WB_START}SENSAO${WB_END}`, "gi"), "SENSAÇÃO"],
  [new RegExp(`${WB_START}PUXAO${WB_END}`, "gi"), "PUXÃO"],
  [new RegExp(`${WB_START}LUBRIFICAO${WB_END}`, "gi"), "LUBRIFICAÇÃO"],
  [new RegExp(`${WB_START}MASTURBAO${WB_END}`, "gi"), "MASTURBAÇÃO"],
  [new RegExp(`${WB_START}EJACULAO${WB_END}`, "gi"), "EJACULAÇÃO"],
  [new RegExp(`${WB_START}ABRAO${WB_END}`, "gi"), "ABRAÇÃO"],
  [new RegExp(`${WB_START}PEGAO${WB_END}`, "gi"), "PEGAÇÃO"],
  [new RegExp(`${WB_START}CLAMAO${WB_END}`, "gi"), "CLAMAÇÃO"],
  [new RegExp(`${WB_START}INICIAO${WB_END}`, "gi"), "INICIAÇÃO"],
  [new RegExp(`${WB_START}LUNAO${WB_END}`, "gi"), "LUNAÇÃO"],
  [new RegExp(`${WB_START}MELHORAO${WB_END}`, "gi"), "MELHORAÇÃO"],
  [new RegExp(`${WB_START}SUBJUGAO${WB_END}`, "gi"), "SUBJUGAÇÃO"],
  [new RegExp(`${WB_START}PULSAO${WB_END}`, "gi"), "PULSAÇÃO"],
  [new RegExp(`${WB_START}ALIMENTAO${WB_END}`, "gi"), "ALIMENTAÇÃO"],
  [new RegExp(`${WB_START}FISCALIZAO${WB_END}`, "gi"), "FISCALIZAÇÃO"],
  [new RegExp(`${WB_START}ESPECIFICAO${WB_END}`, "gi"), "ESPECIFICAÇÃO"],
  [new RegExp(`${WB_START}REABILITAO${WB_END}`, "gi"), "REABILITAÇÃO"],
  [new RegExp(`${WB_START}CAPTIVAO${WB_END}`, "gi"), "CAPTIVAÇÃO"],
  [new RegExp(`${WB_START}ESTICAO${WB_END}`, "gi"), "ESTICAÇÃO"],
  [new RegExp(`${WB_START}MULTIROTAO${WB_END}`, "gi"), "MULTIROTAÇÃO"],

  // ═══════════════════════════════════════════════════════════════
  // 3. Perda de ÁVEL
  // ═══════════════════════════════════════════════════════════════
  [new RegExp(`${WB_START}RECARREGVEL${WB_END}`, "gi"), "RECARREGÁVEL"],
  [new RegExp(`${WB_START}INFLVEL${WB_END}`, "gi"), "INFLÁVEL"],
  [new RegExp(`${WB_START}AJUSTVEL${WB_END}`, "gi"), "AJUSTÁVEL"],
  [new RegExp(`${WB_START}AJSUÁVEL${WB_END}`, "gi"), "AJUSTÁVEL"],
  [new RegExp(`${WB_START}AJUSÁVEL${WB_END}`, "gi"), "AJUSTÁVEL"],
  [new RegExp(`${WB_START}AJDUSTÁVEL${WB_END}`, "gi"), "AJUSTÁVEL"],
  [new RegExp(`${WB_START}IMPERMEVEL${WB_END}`, "gi"), "IMPERMEÁVEL"],
  [new RegExp(`${WB_START}INOXIDVEL${WB_END}`, "gi"), "INOXIDÁVEL"],
  [new RegExp(`${WB_START}RESPIRVEL${WB_END}`, "gi"), "RESPIRÁVEL"],
  [new RegExp(`${WB_START}INTERCAMBIVEL${WB_END}`, "gi"), "INTERCAMBIÁVEL"],
  [new RegExp(`${WB_START}ARTICULVEL${WB_END}`, "gi"), "ARTICULÁVEL"],
  [new RegExp(`${WB_START}DOBRVEL${WB_END}`, "gi"), "DOBRÁVEL"],
  [new RegExp(`${WB_START}CONFORTVEL${WB_END}`, "gi"), "CONFORTÁVEL"],
  [new RegExp(`${WB_START}ADAPTVEL${WB_END}`, "gi"), "ADAPTÁVEL"],
  [new RegExp(`${WB_START}BEIJVEL${WB_END}`, "gi"), "BEIJÁVEL"],
  [new RegExp(`${WB_START}AGRADVEL${WB_END}`, "gi"), "AGRADÁVEL"],
  [new RegExp(`${WB_START}DESAGRADVEL${WB_END}`, "gi"), "DESAGRADÁVEL"],
  [new RegExp(`${WB_START}FLEXIVEL${WB_END}`, "gi"), "FLEXÍVEL"],
  [new RegExp(`${WB_START}ULTRAINFLVEL${WB_END}`, "gi"), "ULTRAINFLÁVEL"],
  [new RegExp(`${WB_START}ELETROFLEXVEL${WB_END}`, "gi"), "ELETROFLEXÍVEL"],

  // ═══════════════════════════════════════════════════════════════
  // 4. Outros acentos perdidos
  // ═══════════════════════════════════════════════════════════════
  [new RegExp(`${WB_START}NAO${WB_END}`, "gi"), "NÃO"],
  [new RegExp(`(?<!Ã)${WB_START}GUA${WB_END}`, "gi"), "ÁGUA"],
  [new RegExp(`(?<!Ã)${WB_START}GUAS${WB_END}`, "gi"), "ÁGUAS"],

  // ═══════════════════════════════════════════════════════════════
  // 5. PT-BR → PT-PT
  // ═══════════════════════════════════════════════════════════════
  [new RegExp(`${WB_START}CONTROLE${WB_END}`, "gi"), "CONTROLO"],
  [new RegExp(`${WB_START}APLICATIVO${WB_END}`, "gi"), "APLICAÇÃO"],
  [new RegExp(`${WB_START}SACOLA${WB_END}`, "gi"), "SACO"],
];

// ═══════════════════════════════════════════════════════════════
// Funções públicas
// ═══════════════════════════════════════════════════════════════

/**
 * Aplica as correções PT-BR → PT-PT ao nome fornecido.
 * Protege nomes de marcas e termos ingleses.
 *
 * Ordem:
 *   1. Fix mojibake (duplo encoding)
 *   2. Proteger marcas/termos
 *   3. Aplicar correções PT-BR/PT-PT
 *   4. Restaurar marcas/termos
 */
export function normalizeToPT(rawName: string): string {
  // 1. Fix mojibake PRIMEIRO
  let name = fixMojibake(rawName);

  // 2. Proteger marcas/termos
  const placeholders = new Map<string, string>();
  let counter = 0;

  for (const term of PROTECTED_TERMS) {
    const regex = new RegExp(
      `\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
      "gi"
    );

    name = name.replace(regex, (match) => {
      const key = `__PROT_${counter}__`;
      placeholders.set(key, match);
      counter++;
      return key;
    });
  }

  // 3. Aplicar correções
  for (const [pattern, replacement] of PT_FIXES) {
    name = name.replace(pattern, replacement);
  }

  // 4. Restaurar marcas/termos protegidos
  for (const [key, original] of placeholders) {
    name = name.replace(key, original);
  }

  return name;
}