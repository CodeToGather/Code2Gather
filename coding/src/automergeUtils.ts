import atob from 'atob';
import Automerge from 'automerge';
import btoa from 'btoa';

export interface TextDoc {
  text: Automerge.Text;
}

export function initDocWithText(text: string): Automerge.Doc<TextDoc> {
  return Automerge.change(Automerge.init<TextDoc>(), (doc) => {
    doc.text = new Automerge.Text(text);
    return doc.text.insertAt?.bind(doc.text)!(0, ...text.split(''));
  });
}

export enum Language {
  PYTHON = 'PYTHON',
  JAVA = 'JAVA',
  JAVASCRIPT = 'JAVASCRIPT',
}

export function binaryChangeToBase64String(
  a: Automerge.BinaryChange[],
): string[] {
  return a.map((b) => btoa(String.fromCharCode(...b)));
}

export function base64StringToBinaryChange(
  s: string[],
): Automerge.BinaryChange[] {
  return s.map((a) => {
    const asciiString = atob(a);
    return new Uint8Array([...asciiString].map((char) => char.charCodeAt(0)));
  }) as Automerge.BinaryChange[];
}
