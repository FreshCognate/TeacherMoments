import React, { Component } from 'react';
import SlateEditor from '../components/slateEditor';
import { Editor, Element, createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import SlateElement from '../components/slateElement';
import SlateLeaf from '../components/slateLeaf';
import toggleMark from '../helpers/toggleMark';
import isHotkey from 'is-hotkey';

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

class SlateEditorContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.editor = withReact(withHistory(createEditor()));

    if (props.onLoad) {
      props.onLoad({ editor: this.editor });
    }

    this.state = {
      value: this.props.value || [{
        type: 'paragraph',
        children: [{ text: '' }],
      }]
    };
  };

  renderElement = (props) => {
    return (
      <SlateElement {...props} />
    );
  };

  renderLeaf = (props) => {
    return (
      <SlateLeaf {...props} />
    );
  };

  onKeyDown = (event) => {

    if (event.key === 'Enter' && event.shiftKey === true) {
      event.preventDefault();
      return Editor.insertText(this.editor, '\n');
    }

    for (const hotkey in HOTKEYS) {
      if (isHotkey(hotkey, event)) {
        event.preventDefault();
        const mark = HOTKEYS[hotkey];
        toggleMark(this.editor, mark);
      }
    }
  };

  onChange = (value) => {
    // this.setState({ value });
    // This line stops the state editor saving on focus
    if (value === this.state.value) return;
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  render() {
    return (
      <SlateEditor
        editor={this.editor}
        value={this.state.value}
        renderElement={this.renderElement}
        renderLeaf={this.renderLeaf}
        placeholder={this.props.placeholder}
        features={this.props.features}
        inputBackground={this.props.inputBackground}
        shouldAutoFocus={this.props.shouldAutoFocus}
        isDisabled={this.props.isDisabled}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
      />
    );
  }
};

export default SlateEditorContainer;