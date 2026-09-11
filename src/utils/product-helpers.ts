
export function extractDescription(html: string): string {
  if (!html) return "";

  let text = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/div>/gi, "\n")
    .replace(/<div[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "");

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

  if (earliestIndex < text.length) {
    text = text.substring(0, earliestIndex);
  }

  return text
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function extractFeatures(html: string): string[] {
  if (!html) return [];

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

  const match = html.match(
    /CARACTER[IÍ]STICAS?[:\s]*([\s\S]*?)(?:ESPECIFICA[CÇÕES]|MEDIDAS|MATERIAL|CONTENIDO|$)/i
  );
  
  if (match) {
    const featuresText = match[1];
    
    const liMatches = featuresText.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (liMatches) {
      return liMatches
        .map((item) => item.replace(/<[^>]+>/g, "").trim())
        .filter((item) => item.length > 0);
    }

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

  const medidasMatch = html.match(
    /\bMEDIDAS?\b\s*:\s*([\s\S]*?)(?:\bMATERIAL\b\s*:|\bCONTENIDO\b\s*:|$)/i
  );
  if (medidasMatch) {
    const medidasText = medidasMatch[1];
    
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

  const materialMatch = html.match(/\bMATERIAL\b\s*:\s*<\/strong>\s*([^<]+)/i);
  if (materialMatch) {
    specs.material = materialMatch[1].trim();
  }

  if (!specs.material) {
    const materialFallback = html.match(
      /\bMATERIAL\b\s*:\s*([^<>\n]*?)(?:\.|$|<)/i
    );
    if (materialFallback) {
      specs.material = materialFallback[1].trim();
    }
  }

  const colorMatch = html.match(/\bCOR\b\s*:\s*([^\n<]+)/i);
  if (colorMatch) {
    specs.color = colorMatch[1].trim();
  }

  const batteryMatch = html.match(/\bBATERIA\b\s*:\s*([^\n<]+)/i);
  if (batteryMatch) {
    specs.battery = batteryMatch[1].trim();
  }

  const weightMatch = html.match(/\bPESO\b\s*:\s*([^\n<]+)/i);
  if (weightMatch) {
    specs.weight = weightMatch[1].trim();
  }

  specs.waterproof = /resistente al agua|waterproof|à prova d[ae] água/i.test(html);

  return specs;
}