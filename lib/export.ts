export function spreadsheetSafe(value:unknown):string|number {
  if(typeof value==='number')return value;
  const s=value==null?'':String(value);return /^[\s]*[=+\-@]/.test(s)?`'${s}`:s;
}
export function csv(rows:unknown[][]):string {return '\uFEFF'+rows.map(row=>row.map(v=>`"${String(spreadsheetSafe(v)).replaceAll('"','""')}"`).join(';')).join('\r\n');}
