import Automerge from 'automerge';

export interface TextDoc {
  text: Automerge.Text;
}

export interface Editor {
  doc: Automerge.Doc<TextDoc>;
  code: string;
  lastSyncedDoc: Automerge.Doc<TextDoc>;
}
