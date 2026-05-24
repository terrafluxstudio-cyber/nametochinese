/** Shared wikitable parser for transliteration matrices */

export function cleanCell(cell) {
  if (!cell) return '';
  return cell
    .replace(/\|style="[^"]*"/gi, '')
    .replace(/\|[^\s|]+="[^"]*"/gi, '')
    .replace(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g, '$1')
    .replace(/\{\{lang\|[^|]+\|([^}]+)\}\}/gi, '$1')
    .replace(/\{\{nowrap\|([^}]+)\}\}/gi, '$1')
    .replace(/\{\{tooltip\|([^|]+)\|[^}]+\}\}/gi, '$1')
    .replace(/\{\{[^}]+\}\}/g, '')
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/'''+/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
}

function splitCells(line) {
  const normalized = line
    .replace(/\|style="[^"]*"/gi, '|')
    .replace(/\|rowspan="\d+"/gi, '|')
    .replace(/\|colspan="\d+"/gi, '|');

  if (normalized.includes('||')) {
    return normalized.split('||').map(c => c.replace(/^\|+/, '').trim());
  }

  return normalized
    .split(/(?<!\|)\|(?!\|)/)
    .map(c => c.trim())
    .filter((c, i) => i > 0 || c.length > 0);
}

function parseRussianRow(chunk) {
  const flat = chunk.replace(/\n/g, ' ');
  const keyMatch = flat.match(/\{\{lang\|ru\|([^}|]+)/i);
  if (!keyMatch) return null;
  const key = cleanCell(keyMatch[1]);
  const values = [];
  for (const part of flat.split('||')) {
    const c = cleanCell(part);
    if (/[\u4e00-\u9fff（）]/.test(c) && !/→|元音|輔音/.test(c)) {
      values.push(c);
    }
  }
  if (values.length < 3) return null;
  return [key, ...values];
}

function parseRowChunk(chunk) {
  const lines = chunk
    .trim()
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && l !== '|' && !l.startsWith('|+') && !l.startsWith('|}'));

  let rowKey = '';
  const valueCells = [];

  for (const line of lines) {
    if (line.startsWith('!')) {
      if (/^!\s*colspan/i.test(line)) continue;
      if (line.includes('||')) {
        const parts = splitCells(line.replace(/^!+/, '!'));
        if (!rowKey) rowKey = cleanCell(parts[0]);
        valueCells.push(...parts.slice(1));
      } else {
        const key = cleanCell(line.replace(/^!+/, ''));
        if (key && !/譯音表/.test(key)) rowKey = key;
      }
    } else if (line.startsWith('|')) {
      valueCells.push(...splitCells(line));
    }
  }

  const values = valueCells.map(cleanCell);
  const key = cleanCell(rowKey);
  if (!key && values.length === 0) return null;
  return [key, ...values];
}

function isMatrixTable(block) {
  if (/collapsible\s+collapsed/i.test(block.slice(0, 300))) return false;
  const rowCount = (block.match(/\n\|-/g) || []).length;
  return rowCount >= 4;
}

function parseMatrixBlock(block) {
  const isRussian = /\{\{lang\|ru\|/i.test(block);
  const body = block.split(/\|\}/)[0];
  const rowChunks = body.split(/\n\|-/);

  let headers = [];
  const dataRows = [];
  let sawColumnHeader = false;

  for (const chunk of rowChunks.slice(1)) {
    const firstLine = chunk.trim().split('\n')[0] || '';

    if (isRussian) {
      const row = parseRussianRow(chunk);
      if (row) dataRows.push(row);
      continue;
    }

    const row = parseRowChunk(chunk);
    if (!row || row.length < 2) continue;

    if (/^!\s*!!/.test(firstLine)) {
      headers = row
        .map(cleanCell)
        .filter((c, i) => i > 0 || (c && !/^!+/.test(c)));
      if (headers[0] === '') headers.shift();
      sawColumnHeader = true;
      continue;
    }

    if (!sawColumnHeader && row[0] === '' && row.length > 5) {
      const chineseCount = row.filter(c => /[\u4e00-\u9fff]/.test(c)).length;
      if (chineseCount < row.length / 3) {
        headers = row.slice(1);
        sawColumnHeader = true;
        continue;
      }
    }

    const values = row.slice(1);
    if (!values.some(v => /[\u4e00-\u9fff]/.test(v))) continue;

    dataRows.push(row.map(cleanCell));
  }

  if (dataRows.length < 3) return null;

  if (headers.length === 0) {
    const width = Math.max(...dataRows.map(r => r.length)) - 1;
    headers = [''].concat(
      Array.from({ length: width }, (_, i) => `col${i + 1}`)
    );
  }

  return { headers, rows: dataRows };
}

export function parseWikitable(wikitext) {
  const tables = [];
  const tableBlocks = wikitext.split(/\{\|/).slice(1);

  for (const block of tableBlocks) {
    if (!isMatrixTable(block)) continue;
    const parsed = parseMatrixBlock(block);
    if (parsed) tables.push(parsed);
  }

  return tables;
}
