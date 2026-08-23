export function extractDescription(html: string): string {
  if (!html) return "";

  // 1. Converte tags HTML em quebras de linha
  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/div>/gi, "\n")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<[^>]+>/g, ""); // Remove outras tags

  // 2. Converte entidades HTML
  const entities: Record<string, string> = {
    '&ntilde;': 'ñ', '&Ntilde;': 'Ñ',
    '&aacute;': 'á', '&Aacute;': 'Á',
    '&eacute;': 'é', '&Eacute;': 'É',
    '&iacute;': 'í', '&Iacute;': 'Í',
    '&oacute;': 'ó', '&Oacute;': 'Ó',
    '&uacute;': 'ú', '&Uacute;': 'Ú',
    '&quot;': '"', '&amp;': '&',
    '&lt;': '<', '&gt;': '>',
    '&nbsp;': ' ', '&middot;': '·',
    '&iexcl;': '¡', '&iquest;': '¿',
    '&euro;': '€', '&copy;': '©',
    '&reg;': '®', '&trade;': '™',
  };
  
  text = text.replace(/&[a-z]+;/gi, match => entities[match.toLowerCase()] || match);

  // 3. Encontra secções que devem ser removidas
  // Usa padrões que só apanham quando estão como TÍTULO (início de linha ou após \n\n)
  const sectionPatterns = [
    /(?:^|\n\n)\s*CARACTER[IÍ]STICAS?\s*:?/i,
    /(?:^|\n\n)\s*ESPECIFICA[ÇC][ÃÕ]ES\s*:?/i,
    /(?:^|\n\n)\s*MEDIDAS?\s*:?/i,
    /(?:^|\n\n)\s*MATERIAL\s*:?/i,
    /(?:^|\n\n)\s*CONTENIDO\s*:?/i,
    /(?:^|\n\n)\s*CONTE[UÚ]DO\s*:?/i,
    /(?:^|\n\n)\s*INSTRUCCIONES\s*:?/i,
    /(?:^|\n\n)\s*ADVERTENCIAS\s*:?/i,
    /(?:^|\n\n)\s*MANTENIMIENTO\s*:?/i,
    /(?:^|\n\n)\s*LIMPIEZA\s*:?/i,
  ];

  let earliestIndex = text.length;

  for (const pattern of sectionPatterns) {
    const match = text.match(pattern);
    if (match && match.index !== undefined && match.index < earliestIndex) {
      earliestIndex = match.index;
    }
  }

  // 4. Corta a descrição
  if (earliestIndex < text.length) {
    text = text.substring(0, earliestIndex);
  }

  // 5. Limpa espaços extras
  return text
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Extrai as características de <li> dentro de <ul>
 * Também suporta marcadores •, -, * e números
 */
export function extractFeatures(html: string): string[] {
  if (!html) return [];

  // 1. Tenta extrair de <li> dentro de <ul> (HTML)
  const ulMatch = html.match(/<ul[^>]*>([\s\S]*?)<\/ul>/i);
  if (ulMatch) {
    const items = ulMatch[1].match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (items) {
      return items
        .map((item) => item.replace(/<[^>]+>/g, "").trim())
        .filter((item) => item.length > 0)
        .slice(0, 15);
    }
  }

  // 2. Tenta encontrar a secção de características com texto
  const match = html.match(
    /CARACTER[IÍ]STICAS?[:\s]*([\s\S]*?)(?:ESPECIFICA[CÇÕES]|MEDIDAS|MATERIAL|CONTENIDO|$)/i
  );
  
  if (match) {
    const featuresText = match[1];
    
    // Tenta extrair <li> da secção
    const liMatches = featuresText.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (liMatches) {
      return liMatches
        .map((item) => item.replace(/<[^>]+>/g, "").trim())
        .filter((item) => item.length > 0);
    }

    // Fallback: dividir por marcadores
    const features = featuresText
      .split(/[•\-\*]|\d+\.\s*/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && !item.match(/^(MEDIDAS|MATERIAL|CONTENIDO|ESPECIFICAÇÕES)/i));

    if (features.length > 0) {
      return features;
    }
  }

  return [];
}

/**
 * Extrai as especificações (MEDIDAS, MATERIAL, etc.)
 */
export function extractSpecifications(html: string): {
  material: string;
  color: string;
  size: string;
  waterproof: boolean;
  dimensions?: string;
  weight?: string;
  battery?: string;
} {
  if (!html) {
    return { material: "", color: "", size: "", waterproof: false };
  }

  const specs = {
    material: "",
    color: "",
    size: "",
    waterproof: false,
    dimensions: "",
    weight: "",
    battery: "",
  };

  // Extrai MEDIDAS
  const medidasMatch = html.match(/MEDIDAS?[:\s]*([\s\S]*?)(?:MATERIAL|CONTENIDO|$)/i);
  if (medidasMatch) {
    const medidasText = medidasMatch[1];
    
    // Tenta extrair de <li>
    const liMatches = medidasText.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (liMatches) {
      liMatches.forEach((item) => {
        const text = item.replace(/<[^>]+>/g, "").trim();
        const longMatch = text.match(/Longitud[:\s]*(\d+)\s*mm/i);
        const diamMatch = text.match(/Di[áa]metro[:\s]*(\d+)\s*mm/i);
        if (longMatch) specs.size = `${longMatch[1]} mm`;
        if (longMatch && diamMatch) {
          specs.dimensions = `${longMatch[1]} x ${diamMatch[1]} mm`;
        } else if (longMatch) {
          specs.dimensions = `${longMatch[1]} mm`;
        }
      });
    } else {
      // Fallback: texto simples
      const longMatch = medidasText.match(/Longitud[:\s]*(\d+)\s*mm/i);
      const diamMatch = medidasText.match(/Di[áa]metro[:\s]*(\d+)\s*mm/i);
      if (longMatch) specs.size = `${longMatch[1]} mm`;
      if (longMatch && diamMatch) {
        specs.dimensions = `${longMatch[1]} x ${diamMatch[1]} mm`;
      } else if (longMatch) {
        specs.dimensions = `${longMatch[1]} mm`;
      }
    }
  }

  // Extrai MATERIAL - procura por <p><strong>MATERIAL:</strong> ...
  const materialMatch = html.match(/MATERIAL:<\/strong>\s*([^<]+)/i);
  if (materialMatch) {
    specs.material = materialMatch[1].trim();
  }

  // Fallback: procura por MATERIAL: seguido de texto
  if (!specs.material) {
    const materialFallback = html.match(/MATERIAL[:\s]*([^<>\n]*?)(?:\.|$|<)/i);
    if (materialFallback) {
      specs.material = materialFallback[1].trim();
    }
  }

  // Extrai COR (se existir)
  const colorMatch = html.match(/COR[:\s]*([^\n<]+)/i);
  if (colorMatch) {
    specs.color = colorMatch[1].trim();
  }

  // Extrai BATERIA (se existir)
  const batteryMatch = html.match(/BATERIA[:\s]*([^\n<]+)/i);
  if (batteryMatch) {
    specs.battery = batteryMatch[1].trim();
  }

  // Extrai PESO (se existir)
  const weightMatch = html.match(/PESO[:\s]*([^\n<]+)/i);
  if (weightMatch) {
    specs.weight = weightMatch[1].trim();
  }

  // Verifica se é à prova de água
  specs.waterproof = /resistente al agua|waterproof|à prova d[ae] água/i.test(html);

  return specs;
}