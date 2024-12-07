import classnames from 'classnames';
import React from 'react';
import isValueEmpty from '~/core/slate/helpers/isValueEmpty';

type TitleProps = {
  title: string,
  element?: string | React.FunctionComponent,
  className?: string,
  size?: string
}

const Title = ({ title, element = 'h1', className, size }: TitleProps) => {

  let Element = element as keyof JSX.IntrinsicElements;

  if (isValueEmpty(title)) return null;

  return (
    <Element className={classnames({
      'text-3xl': size === '3xl',
      'text-2xl': size === '2xl',
      'text-xl': size === 'xl',
      'text-lg': size === 'lg',
      'text-sm': size === 'sm'
    }, className)} dangerouslySetInnerHTML={{ __html: title }} />
  )
};

export default Title;