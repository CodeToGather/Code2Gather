/* eslint-disable @typescript-eslint/no-non-null-assertion */
// Adapted from https://github.com/jonfk/text-crdt-experiment-automerge-ts, which adapted
// it from https://lorefnon.tech/2018/09/23/using-google-diff-match-patch-with-automerge-text/

import Automerge from 'automerge';
import DiffMatchPatch from 'diff-match-patch';

import { TextDoc } from '../types/automerge';

export const changeTextDoc = (
  doc: Automerge.Doc<TextDoc>,
  updatedText: string,
): Automerge.Doc<TextDoc> => {
  const dmp = new DiffMatchPatch.diff_match_patch();

  // Compute the diff:
  const diff = dmp.diff_main(doc.text.toString(), updatedText);
  // diff is simply an array of binary tuples representing the change
  // [[-1,"The ang"],[1,"Lucif"],[0,"e"],[-1,"l"],[1,"r"],[0," shall "],[-1,"fall"],[1,"rise"]]

  // This cleans up the diff so that the diff is more human friendly.
  dmp.diff_cleanupSemantic(diff);
  // [[-1,"The angel"],[1,"Lucifer"],[0," shall "],[-1,"fall"],[1,"rise"]]

  const patches = dmp.patch_make(doc.text.toString(), diff);
  // console.log(patches);

  // A patch object wraps the diffs along with some change metadata:
  //
  // [{
  //   "diffs":[[-1,"The angel"],[1,"Lucifer"],[0," shall "],[-1,"fall"], [1,"rise"]],
  //   "start1":0,
  //   "start2":0,
  //   "length1":20,
  //   "length2":18
  // }]

  // We can use the patch to derive the changedText from the sourceText
  // console.log(dmp.patch_apply(patches, doc.text.toString())[0]); // "Lucifer shall rise"

  // Now we translate these patches to operations against Automerge.Text instance:
  const newDoc = Automerge.change(doc, (doc1) => {
    patches.forEach((patch) => {
      let idx = patch.start1;
      if (idx !== null) {
        patch.diffs.forEach(([operation, changeText]) => {
          switch (operation) {
            case 1: // Insertion
              doc1.text.insertAt?.bind(doc1.text)!(
                idx!,
                ...changeText.split(''),
              );
              idx! += changeText.length;
              break;
            case 0: // No Change
              idx! += changeText.length;
              break;
            case -1: // Deletion
              for (let i = 0; i < changeText.length; i++) {
                doc1.text.deleteAt!(idx!);
              }
              break;
          }
        });
      }
    });
  });
  return newDoc;
};

export function initDocWithText(text: string): Automerge.Doc<TextDoc> {
  return Automerge.change(Automerge.init<TextDoc>(), (doc) => {
    doc.text = new Automerge.Text(text);
    return doc.text.insertAt?.bind(doc.text)!(0, ...text.split(''));
  });
}

export function binaryChangeToBase64String(
  a: Automerge.BinaryChange[],
): string[] {
  return a.map((b) => window.btoa(String.fromCharCode(...b)));
}

export function base64StringToBinaryChange(
  s: string[],
): Automerge.BinaryChange[] {
  return s.map((a) => {
    const asciiString = window.atob(a);
    return new Uint8Array([...asciiString].map((char) => char.charCodeAt(0)));
  }) as Automerge.BinaryChange[];
}
