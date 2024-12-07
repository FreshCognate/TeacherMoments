import { Editor, Transforms, Node, Path } from 'slate';
export default function addIndent(editor) {
  const { selection } = editor;
  if (!selection) return false;
  const [parentElement, parentPath] = Editor.parent(editor, Editor.unhangRange(editor, selection));

  if (Editor.isEditor(parentElement)) {
    return;
  }

  if (parentElement) {
    if (parentElement.type === 'listItem') {
      // Check if another ul exists before or after
      const parentBlockElement = Node.parent(editor, parentPath);
      const parentBlockType = parentBlockElement.type;

      let hasMatchingPreviousBlock = false;
      let hasMatchingNextBlock = false;
      let nextNode;
      let previousNode;
      let previousSiblingPath;

      const nextSiblingPath = Path.next(parentPath);

      if (Node.has(editor, nextSiblingPath)) {
        nextNode = Node.get(editor, nextSiblingPath);
        if (nextNode && nextNode.type === parentBlockType) {
          hasMatchingNextBlock = true;
        }
      }

      if (Path.hasPrevious(parentPath)) {
        previousSiblingPath = Path.previous(parentPath);
        previousNode = Node.get(editor, previousSiblingPath);
        if (previousNode && previousNode.type === parentBlockType) {
          hasMatchingPreviousBlock = true;
        }
      }

      if (hasMatchingNextBlock && hasMatchingPreviousBlock) {
        const [lastChild] = Node.children(editor, previousSiblingPath, { reverse: true });
        lastChild[1][lastChild[1].length - 1] = lastChild[1][lastChild[1].length - 1] + 1;

        Transforms.moveNodes(editor, {
          at: nextSiblingPath,
          to: lastChild[1]
        });

        Transforms.moveNodes(editor, {
          at: parentPath,
          to: lastChild[1]
        });

        const [lastNewChild] = Node.children(editor, previousSiblingPath, { reverse: true });

        Transforms.unwrapNodes(editor, {
          at: lastNewChild[1]
        });

        return;
      }

      if (hasMatchingNextBlock && !hasMatchingPreviousBlock) {
        const [firstChild] = Node.children(editor, nextSiblingPath);
        Transforms.moveNodes(editor, {
          at: parentPath,
          to: firstChild[1]
        });
        return;
      }

      if (!hasMatchingNextBlock && hasMatchingPreviousBlock) {
        const [lastChild] = Node.children(editor, previousSiblingPath, { reverse: true });

        lastChild[1][lastChild[1].length - 1] = lastChild[1][lastChild[1].length - 1] + 1;

        Transforms.moveNodes(editor, {
          at: parentPath,
          to: lastChild[1]
        });

        return;
      }

      const block = { type: parentBlockType, children: [] };
      Transforms.wrapNodes(editor, block);
      return;
    }

    const currentIndent = parentElement.indent || 0;
    if (currentIndent < 4) {
      Transforms.setNodes(editor, { indent: currentIndent + 1 });
    }
  }
}