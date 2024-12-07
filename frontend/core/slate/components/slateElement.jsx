import React from 'react';

const SlateElement = ({
  attributes,
  children,
  element
}) => {
  const style = { textAlign: element.align, textIndent: `${((element.indent || 0) * 16)}px` };

  switch (element.type) {
    case 'blockquote':
      return (
        <blockquote className="blockquote" style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bulletedList':
      return (
        <ul className="list-disc list-outside pl-rem" style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'listItem':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numberedList':
      return (
        <ol className="list-decimal list-outside pl-rem" style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'link':
      return (
        <a {...attributes} {...element.props} target="_blank" className="underline">
          {children}
        </a>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

export default SlateElement;