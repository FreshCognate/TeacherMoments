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
    type: 'mark'
  },
  italic: {
    format: 'italic',
    icon: 'italic',
    type: 'mark'
  },
  underline: {
    format: 'underline',
    icon: 'underline',
    type: 'mark'
  },
  strikethrough: {
    format: 'strikethrough',
    icon: 'strikethrough',
    type: 'mark'
  },
  code: {
    format: 'code',
    icon: 'codeblock',
    type: 'mark'
  },
  blockquote: {
    format: 'blockquote',
    icon: 'blockquote',
    type: 'block'
  },
  link: {
    format: 'link',
    icon: 'link',
    type: 'block'
  },
  numberedList: {
    format: 'numberedList',
    icon: 'numberedList',
    type: 'block'
  },
  bulletedList: {
    format: 'bulletedList',
    icon: 'bulletedList',
    type: 'block'
  },
  indent: {
    format: 'indent',
    icon: 'indent',
    type: 'block'
  },
  outdent: {
    format: 'outdent',
    icon: 'outdent',
    type: 'block'
  },
  leftAlign: {
    format: 'left',
    icon: 'leftAlign',
    type: 'block'
  },
  centerAlign: {
    format: 'center',
    icon: 'centerAlign',
    type: 'block'
  },
  rightAlign: {
    format: 'right',
    icon: 'rightAlign',
    type: 'block'
  },
  justifyAlign: {
    format: 'justify',
    icon: 'justifyAlign',
    type: 'block'
  }
};

const getFeature = (feature, editor) => {
  const { type, format, icon } = FEATURES[feature];
  const Component = type === 'mark' ? SlateMarkButton : SlateBlockButton;
  return (<Component key={feature} editor={editor} format={format} icon={icon} />);
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
    "py-1 px-2 rounded-b focus:outline-2 focus:outline-primary-regular  focus:dark:border-primary-light border border-lm-3 transition-colors duration-300",
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