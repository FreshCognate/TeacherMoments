import has from 'lodash/has';
import each from 'lodash/each';
import escapeHtml from 'escape-html';

export default function (value, isTitle) {
  let string = '';

  const getElement = (element, valueLength) => {

    let elementTag = isTitle ? 'span' : 'p';
    let classes = '';
    let elementChildren = '';
    let hrefString = '';
    let targetString = '';
    let styles = '';

    if (element.type === 'paragraph') {
      if (isTitle) {
        classes += 'block ';
      }
      // Takes into account empty string to create new lines
      if (element.children.length === 1 && element.children[0].text === "" && valueLength > 1) {
        elementTag = 'br';
      }
      if (element.children.length === 1 && element.children[0].text === "" && valueLength === 1) {
        return "";
      }
    }

    if (element.type === 'blockquote') {
      elementTag = 'blockquote';
      classes += 'blockquote ';
    }

    if (element.type === 'numberedList') {
      elementTag = 'ol';
      classes += 'list-decimal list-outside pl-rem ';
    }

    if (element.type === 'bulletedList') {
      elementTag = 'ul';
      classes += 'list-disc list-outside pl-rem ';
    }

    if (element.type === 'listItem') {
      elementTag = 'li';
    }

    if (element.type === 'link') {
      elementTag = 'a';
      classes += 'underline ';
      hrefString = ` href="${escapeHtml(element.props.href)}"`;
      targetString = ` target="_blank"`;
    }

    if (has(element, 'text')) {
      elementTag = 'span';
      elementChildren = escapeHtml(element.text)
        .replace(/ {2}/g, ' &nbsp;')
        .replace(/\r\n|\n|\r/gm, '<br />');
    }

    if (element.bold) {
      classes += 'font-bold ';
    }

    if (element.underline) {
      classes += 'underline ';
    }

    if (element.italic) {
      classes += 'italic ';
    }

    if (element.strikethrough) {
      classes += 'line-through ';
    }

    if (element.code) {
      elementTag = 'code';
      classes += 'code ';
    }

    if (element.align) {
      classes += `editor-text-${element.align} `;
    }

    if (element.indent) {
      styles += `text-indent: ${element.indent * 16}px;`;
    }

    if (element.children) {
      each(element.children, (child) => {
        elementChildren += getElement(child);
      });
    }

    const classString = classes.length ? ` class="${classes}"` : '';
    const styleString = styles.length ? ` style="${styles}"` : '';

    if (elementTag === 'br') {
      return `<br />`;
    }

    return `<${elementTag}${classString}${hrefString}${targetString}${styleString}>${elementChildren}</${elementTag}>`;

  };

  each(value, (block) => {
    const blockText = getElement(block, value.length);
    string += blockText;
  });

  return string;
}