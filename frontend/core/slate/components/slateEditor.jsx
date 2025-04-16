import React from 'react';
import { Editable, Slate } from 'slate-react';
import SlateToolbar from './slateToolbar';
import SlateMarkButton from './slateMarkButton';
import SlateBlockButton from './slateBlockButton';
import map from 'lodash/map';
import classnames from 'classnames';

const INPUT_BACKGROUND_COLORS = {
  'note': 'bg-gradient-to-br from-yellow-50 to-yellow-50'
};

const FEATURES = {
  bold: {
    format: 'bold',
    icon: 'bold',
    type: 'mark',
    title: 'Bold'
  },
  italic: {
    format: 'italic',
    icon: 'italic',
    type: 'mark',
    title: 'Italic'
  },
  underline: {
    format: 'underline',
    icon: 'underline',
    type: 'mark',
    title: 'Underline'
  },
  strikethrough: {
    format: 'strikethrough',
    icon: 'strikethrough',
    type: 'mark',
    title: 'Strikethrough'
  },
  code: {
    format: 'code',
    icon: 'codeblock',
    type: 'mark',
    title: 'Code block'
  },
  blockquote: {
    format: 'blockquote',
    icon: 'blockquote',
    type: 'block',
    title: 'Blockquote'
  },
  link: {
    format: 'link',
    icon: 'link',
    type: 'block',
    title: 'Link'
  },
  numberedList: {
    format: 'numberedList',
    icon: 'numberedList',
    type: 'block',
    title: 'Numbered list'
  },
  bulletedList: {
    format: 'bulletedList',
    icon: 'bulletedList',
    type: 'block',
    title: 'Bulleted list'
  },
  indent: {
    format: 'indent',
    icon: 'indent',
    type: 'block',
    title: 'Indent'
  },
  outdent: {
    format: 'outdent',
    icon: 'outdent',
    type: 'block',
    title: 'Outdent'
  },
  leftAlign: {
    format: 'left',
    icon: 'leftAlign',
    type: 'block',
    title: 'Left align'
  },
  centerAlign: {
    format: 'center',
    icon: 'centerAlign',
    type: 'block',
    title: 'Center align'
  },
  rightAlign: {
    format: 'right',
    icon: 'rightAlign',
    type: 'block',
    title: 'Right align'
  },
  justifyAlign: {
    format: 'justify',
    icon: 'justifyAlign',
    type: 'block',
    title: 'Justify'
  }
};

const getFeature = (feature, editor) => {
  const { type, format, icon, title } = FEATURES[feature];
  const Component = type === 'mark' ? SlateMarkButton : SlateBlockButton;
  return (<Component key={feature} editor={editor} format={format} icon={icon} title={title} />);
};

const SlateEditor = ({
  editor,
  value,
  renderElement,
  renderLeaf,
  placeholder,
  features = [],
  inputBackground,
  shouldAutoFocus,
  isDisabled,
  onKeyDown,
  onChange
}) => {

  const hasFeatures = (features && features.length > 0);

  const editableClassName = classnames(
    "py-1 px-2 rounded-b text-sm text-black/80 dark:text-white/80 bg-lm-4/50 dark:bg-dm-4/50 focus:outline-2 focus:outline-lm-4 focus:dark:outline-dm-4 transition-colors duration-300",
    INPUT_BACKGROUND_COLORS[inputBackground],
    { 'rounded-t-4': !hasFeatures }
  );

  return (
    <Slate editor={editor} initialValue={value} onChange={onChange}>
      {(hasFeatures) && (
        <SlateToolbar>
          {map(features, (feature) => {
            return getFeature(feature, editor);
          })}
        </SlateToolbar>
      )}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        spellCheck
        autoFocus={shouldAutoFocus}
        readOnly={isDisabled}
        className={editableClassName}
        onKeyDown={onKeyDown}
      />
    </Slate>
  );
};

export default SlateEditor;