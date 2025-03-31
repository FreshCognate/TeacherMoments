import FormContainer from "~/core/forms/containers/formContainer";
import FlatButton from "~/uikit/buttons/components/flatButton";
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

      <div className=" ">
        {map(value, (action, index) => {
          return (
            <div key={action._id} className="bg-lm-1 dark:bg-dm-1 mb-2 rounded-lg overflow-hidden group/actionItem">
              <div className="p-4">
                <FormContainer
                  schema={schema.subSchema}
                  model={action}
                  onUpdate={(formUpdate) => onUpdateAction(action._id, formUpdate)}
                />
              </div>
              <div className="bg-lm-3 dark:bg-dm-2 px-2 py-2 flex justify-between group-hover/actionItem:opacity-100">
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
      <div className="inline-flex">
        <Button icon="create" color="primary" text={schema.addButtonText} onClick={onAddActionClicked} />
      </div>
    </div>
  );
};

export default ArrayFormField;