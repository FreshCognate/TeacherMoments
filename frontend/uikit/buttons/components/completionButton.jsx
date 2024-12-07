import classnames from 'classnames';
import BaseButton from './baseButton';

export default function CompletionButton({
  status,
  onClick
}) {

  const completeClassName = classnames('transition-all absolute top-0 w-[20px] h-[20px] opacity-0', {
    'opacity-100 group-hover:opacity-70': status === 'COMPLETE',
    'group-hover:opacity-70': status !== 'COMPLETE'
  });

  const inProgressClassName = classnames('absolute top-0 w-[20px] h-[20px] opacity-100', {
    'group-hover:opacity-0': status === 'IN_PROGRESS'
  });

  const inCompleteClassName = classnames('absolute top-0 w-[20px] h-[20px] opacity-0', {
    'group-hover:opacity-100': status === 'IN_PROGRESS',
    'transition-all group-hover:opacity-70': status === 'COMPLETE',
    'opacity-100': status === 'INCOMPLETE'
  });

  return (
    <div className={`group relative justify-center w-[20px] h-[20px]`}>

      <div className='absolute top-0 w-[20px] h-[20px]'>
        {(status === 'IN_PROGRESS') && (
          <div className={inProgressClassName}>
            <BaseButton
              icon='inProgress'
              iconSize={20}
              title='Toggle Complete'
              onClick={onClick}
            />
          </div>
        )}

        <div className={inCompleteClassName}>
          <BaseButton
            icon='incomplete'
            iconSize={20}
            title='Toggle Complete'
            onClick={onClick}
          />
        </div>
      </div>

      <div className={completeClassName}>
        <BaseButton
          icon='complete'
          iconSize={20}
          title='Toggle Complete'
          onClick={onClick}
        />
      </div>

    </div>
  );
}