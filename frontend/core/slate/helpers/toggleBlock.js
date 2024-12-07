import { Editor, Transforms, Element, Range } from 'slate';
import isUrl from 'is-url';
import addIndent from './addIndent';
import removeIndent from './removeIndent';

const LIST_TYPES = ['numberedList', 'bulletedList'];
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'];

const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  });
  return !!link;
};

export const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        n[blockType] === format,
    })
  );

  return !!match;
};

const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === 'link',
  });
};

const toggleLink = (editor) => {
  if (isLinkActive(editor)) {
    return unwrapLink(editor);
  }
  const { isInline } = editor;

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };

  const href = window.prompt('Link');
  if (!href || !isUrl(href)) return;

  if (!editor.selection) return;

  const { selection } = editor;

  const isCollapsed = selection && Range.isCollapsed(selection);

  const link = {
    type: 'link',
    props: { href },
    children: isCollapsed ? [{ text: href }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

export default function toggleBlock(editor, format) {

  if (format === 'link') {
    toggleLink(editor);
    return;
  }

  if (format === 'indent') {
    addIndent(editor);
    return;
  }

  if (format === 'outdent') {
    removeIndent(editor);
    return;
  }

  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  );
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      LIST_TYPES.includes(n.type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  });
  let newProperties;
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'listItem' : format,
    };
  }
  Transforms.setNodes(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}