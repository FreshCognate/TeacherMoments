import FormContainer from "~/core/forms/containers/formContainer";
import FlatButton from "~/uikit/buttons/components/flatButton";
import ConfirmButton from '~/uikit/buttons/components/confirmButton';
import map from 'lodash/map';
import Button from "~/uikit/buttons/components/button";

const ArrayFormField = ({
  value,
  schema,
  onUpdateAction,
  onAddActionClicked,
  onRemoveActionClicked,
  onSortActionUpClicked,
  onSortActionDownClicked
}) => {

  return (
    <div>

      <div className="p-2 bg-lm-2 dark:bg-dm-2 rounded-lg rounded-bl-none">
        {map(value, (action, index) => {
          return (
            <div key={action._id} className="bg-lm-1 border border-lm-3 dark:border-none dark:bg-dm-1 mb-2 last:mb-0 rounded-md overflow-hidden group/actionItem">
              <div className="p-4">
                <FormContainer
                  schema={schema.subSchema}
                  model={action}
                  onUpdate={(formUpdate) => onUpdateAction(action._id, formUpdate)}
                />
              </div>
              {(schema.shouldStopLastItemDelete && value.length === 1)
                ? null : (
                  <div className="bg-lm-1 dark:bg-dm-1 px-2 py-2 flex justify-between group-hover/actionItem:opacity-100">
                    <div>
                      <ConfirmButton icon="delete" title={schema.deleteTitleText} color="warning" onClick={() => onRemoveActionClicked(action._id)} />
                    </div>
                    <div className="flex items-center">
                      {(index !== 0) && (
                        <FlatButton icon="sortUp" title="Sort up" onClick={() => onSortActionUpClicked(index)} />
                      )}
                      {(index !== value.length - 1) && (
                        <FlatButton icon="sortDown" title="Sort down" className="ml-3" onClick={() => onSortActionDownClicked(index)} />
                      )}
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
      <div className="inline-flex">
        <Button icon="create" color="secondary" className="rounded-t-none" text={schema.addButtonText} onClick={onAddActionClicked} />
      </div>
    </div>
  );
};

export default ArrayFormField;