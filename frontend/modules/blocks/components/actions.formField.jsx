import FormContainer from "~/core/forms/containers/formContainer";
import FlatButton from "~/uikit/buttons/components/flatButton";
import map from 'lodash/map';

const ActionsFormField = ({
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

      <div className="border rounded rounded-bl-none border-lm-3 dark:border-dm-3">
        {map(value, (action, index) => {
          return (
            <div key={action._id} className="border-b last:border-b-0 border-lm-3 dark:border-dm-3 group/actionItem">
              <div className="p-2">
                <FormContainer
                  schema={schema.subSchema}
                  model={action}
                  onUpdate={(formUpdate) => onUpdateAction(action._id, formUpdate)}
                />
              </div>
              <div className="bg-lm-2 dark:bg-dm-2 px-2 py-1 flex justify-between opacity-0 group-hover/actionItem:opacity-100">
                <div>
                  <FlatButton icon="delete" color="warning" onClick={() => onRemoveActionClicked(action._id)} />
                </div>
                <div className="flex items-center">
                  {(index !== 0) && (
                    <FlatButton icon="sortUp" onClick={() => onSortActionUpClicked(index)} />
                  )}
                  {(index !== value.length - 1) && (
                    <FlatButton icon="sortDown" className="ml-3" onClick={() => onSortActionDownClicked(index)} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border-b border-x border-lm-3 dark:border-dm-3 inline-flex rounded-b">
        <FlatButton icon="create" text="Add action" className="py-1 px-2" onClick={onAddActionClicked} />
      </div>
    </div>
  );
};

export default ActionsFormField;