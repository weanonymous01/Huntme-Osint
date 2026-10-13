import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Masks house numbers, flat/plot/door numbers, and premise identifiers in addresses with '**'
 * e.g.:
 * - "HOUSE NO 490 KHERA" -> "HOUSE NO ** KHERA"
 * - "H NO 123/B NEAR TEMPLE" -> "H NO ** NEAR TEMPLE"
 * - "46 Habitpur, Gali No 2 Dundhera" -> "** Habitpur, Gali No ** Dundhera"
 */
export function maskAddressNumbers(addr: string | null | undefined): string | null {
  if (!addr || typeof addr !== 'string') return (addr as any) || null;

  let result = addr;

  // 1. Matches premise indicators (House No, Flat No, Plot No, Door No, Gali No, Ward No, etc.)
  // followed by numbers/alphanumeric house IDs (e.g. 490, 490/A, 12-B)
  const prefixRegex = /\b(house\s*(?:no|num|number)?|h\s*\.?\s*no|hno|flat\s*(?:no|num|number)?|plot\s*(?:no|num|number)?|door\s*(?:no|num|number)?|d\s*\.?\s*no|shop\s*(?:no|num|number)?|khasra\s*(?:no|num|number)?|khata\s*(?:no|num|number)?|ward\s*(?:no|num|number)?|gali\s*(?:no|num|number)?|street\s*(?:no|num|number)?|road\s*(?:no|num|number)?|lane\s*(?:no|num|number)?|building\s*(?:no|num|number)?|bldg\s*(?:no|num|number)?|room\s*(?:no|num|number)?|holding\s*(?:no|num|number)?|kh\s*\.?\s*no|no\b\.?|#)[\s.:#-]*([0-9]+[a-zA-Z0-9\/-]*)\b/gi;
  result = result.replace(prefixRegex, (match, prefix) => {
    return prefix.trimEnd() + ' **';
  });

  // 2. Matches standalone premise numbers at the start of an address or after punctuation/delimiters
  // (e.g. "46 Habitpur", ", 490 Khera", "! 46 Habitpur", excluding 6-digit Indian PIN codes like 201301)
  const standaloneRegex = /(^|[,!;\/]\s*)(?:#\s*)?([0-9]{1,5}(?:[/-][0-9a-zA-Z]+)?|[0-9]+[a-zA-Z])(?=\s+[a-zA-Z])/gi;
  result = result.replace(standaloneRegex, (match, sep, num) => {
    if (/^\d{6}$/.test(num.trim())) return match;
    return (sep || '') + '**';
  });

  return result;
}
