/**
 * Teste DISC · Mulheres — recebe as respostas e grava no Google Sheets
 *
 * COMO CONFIGURAR (uma vez só, ~3 minutos):
 * 1. Crie uma planilha nova no Google Sheets (ex.: "Teste DISC - Evento").
 * 2. Menu Extensões → Apps Script. Apague o código que aparecer e cole TODO este arquivo.
 * 3. Clique em Salvar (ícone de disquete).
 * 4. Clique em Implantar → Nova implantação → ícone de engrenagem → "App da Web".
 *      - Executar como: Eu
 *      - Quem pode acessar: Qualquer pessoa
 *    Clique em Implantar e autorize com sua conta Google
 *    (se aparecer "app não verificado": Avançado → Acessar projeto).
 * 5. Copie a "URL do app da Web" (termina em /exec) e cole em
 *    assets/js/config.js → SHEETS_ENDPOINT.
 *
 * Cada pessoa vira UMA linha (identificada pelo ID). A linha é criada assim que ela
 * informa nome, WhatsApp e e-mail, e é completada quando ela termina o teste,
 * baixa o PDF ou clica no WhatsApp. Quem para no meio também fica registrada
 * (Status = "Iniciou o teste"), bom para fazer contato depois.
 *
 * Se editar este código depois: Implantar → Gerenciar implantações → editar (lápis)
 * → Versão: "Nova versão" → Implantar. A URL continua a mesma.
 */

const SHEET_NAME = 'Respostas';
const HEADERS = [
  'ID', 'Data/hora', 'Nome', 'WhatsApp', 'E-mail', 'Status',
  'Perfil principal', 'Perfil secundário', '% D', '% I', '% S', '% C',
  'Concluiu em', 'Baixou PDF', 'Clicou WhatsApp', 'Respostas (pergunta:fator)',
  'Evento', 'Origem (UTM)'
];
const COL = {}; HEADERS.forEach(function (h, i) { COL[h] = i + 1; });

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!d.id) return json({ ok: false, error: 'sem id' });

    const sh = getSheet();
    const now = new Date();
    let row = findRow(sh, d.id);
    if (!row) {
      sh.appendRow([d.id, now]);
      row = sh.getLastRow();
    }

    const set = function (header, value) {
      if (value === undefined || value === null || value === '') return;
      sh.getRange(row, COL[header]).setValue(value);
    };

    set('Nome', d.nome);
    set('WhatsApp', d.whatsapp);
    set('E-mail', d.email);
    set('Evento', d.evento);
    set('Origem (UTM)', d.origem);

    if (d.acao === 'lead') {
      set('Status', 'Iniciou o teste');
    }
    if (d.acao === 'resultado') {
      set('Status', 'Concluiu');
      set('Perfil principal', d.perfil);
      set('Perfil secundário', d.secundario);
      set('% D', d.D); set('% I', d.I); set('% S', d.S); set('% C', d.C);
      set('Concluiu em', now);
      set('Respostas (pergunta:fator)', d.respostas);
    }
    if (d.acao === 'pdf') set('Baixou PDF', 'Sim');
    if (d.acao === 'whatsapp') {
      set('Clicou WhatsApp', 'Sim');
      set('Status', 'Interessada na análise completa');
    }

    return json({ ok: true, row: row });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, msg: 'Endpoint do Teste DISC funcionando.' });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold').setBackground('#3A1530').setFontColor('#FFFFFF');
    sh.getRange('B:B').setNumberFormat('dd/MM/yyyy HH:mm');
    sh.getRange('M:M').setNumberFormat('dd/MM/yyyy HH:mm');
    sh.getRange('D:D').setNumberFormat('@');
  }
  return sh;
}

function findRow(sh, id) {
  const last = sh.getLastRow();
  if (last < 2) return 0;
  const hit = sh.getRange(2, 1, last - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
  return hit ? hit.getRow() : 0;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Rode esta função uma vez no editor para testar (Executar → testar). */
function testar() {
  doPost({ postData: { contents: JSON.stringify({ id: 'TESTE-1', acao: 'lead', nome: 'Teste', whatsapp: '(61) 99999-9999', email: 'teste@teste.com', evento: 'Teste' }) } });
  doPost({ postData: { contents: JSON.stringify({ id: 'TESTE-1', acao: 'resultado', perfil: 'Estável (S)', secundario: 'Influente (I)', D: 13, I: 31, S: 44, C: 12, respostas: '1:S 2:I' }) } });
}
