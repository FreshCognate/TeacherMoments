import React from 'react';
import Form from '~/core/forms/components/form';
import FormContainer from '~/core/forms/containers/formContainer';
import FlatButton from '~/uikit/buttons/components/flatButton';

const DialogPanel = (props) => {
  const panel = props.panel;
  const model = props[panel.cache]
  return (
    <div className="fixed w-[280px] overflow-y-auto bg-lm-0 dark:bg-dm-1 shadow-md border border-lm-1 dark:border-dm-1 rounded-lg"
      style={panel.style}
    >
      <div className="flex justify-between items-center">
        <div className="text-sm font-bold px-2 py-micro">{panel.title}</div>
        <FlatButton icon="cancel" onClick={panel.triggerClose} />
      </div>
      <div className="p-2">
        <FormContainer
          schema={panel.schema}
          model={model}
          onUpdate={({ update }) => panel.updateFields(update)}
        />
      </div>
    </div>
  );
};

export default DialogPanel;