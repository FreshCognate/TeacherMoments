import { Editor, Transforms, Node, Path } from 'slate';
export default function removeIndent(editor) {
  const { selection } = editor;
  if (!selection) return false;
  const [parentElement, parentPath] = Editor.parent(editor, Editor.unhangRange(editor, selection));
  if (parentElement) {
    if (parentElement.type === 'listItem') {
      const [parentBlockElement, parentBlockPath] = Editor.parent(editor, parentPath);

      if (parentBlockElement) {
        if (parentBlockElement.type === 'bulletedList' || parentBlockElement.type === 'numberedList') {
          const [nestedParentBlockElement] = Editor.parent(editor, parentBlockPath);

          if (nestedParentBlockElement && (nestedParentBlockElement.type === 'bulletedList' || nestedParentBlockElement.type === 'numberedList')) {
            Transforms.liftNodes(editor);
          }
        }
      }
    }
    const currentIndent = parentElement.indent || 0;
    if (currentIndent > 0) {
      Transforms.setNodes(editor, { indent: currentIndent - 1 });
    }
  }

}