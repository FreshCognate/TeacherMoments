import FormContainer from "~/core/forms/containers/formContainer";
import FlatButton from "~/uikit/buttons/components/flatButton";
import ConfirmButton from '~/uikit/buttons/components/confirmButton';
import map from 'lodash/map';
import Button from "~/uikit/buttons/components/button";
import classnames from 'classnames';

const ArrayFormField = ({
  value,
  schema,
  onUpdateItem,
  onAddItemClicked,
  onRemoveItemClicked,
  onSortItemUpClicked,
  onSortItemDownClicked
}) => {

  return (
    <div>

      <div className="p-2 bg-lm-2 dark:bg-dm-2 rounded-lg rounded-bl-none">
        {map(value, (item, index) => {
          return (
            <div key={`item-${index}`} className={classnames("bg-lm-1 border border-lm-3 dark:border-none dark:bg-dm-1 mb-2 last:mb-0 rounded-md overflow-hidden group/itemItem opacity-100 transition-opacity duration-300", {
              "opacity-40": !item._id
            })}>
              <div className="p-4">
                <div className="text-black/80 dark:text-white/80 text-sm mb-4">
                  {schema.itemPrefixText} {index + 1}
                </div>
                <FormContainer
                  schema={schema.subSchema}
                  model={item}
                  onUpdate={(formUpdate) => onUpdateItem(item._id, formUpdate)}
                />
              </div>
              {(schema.shouldStopLastItemDelete && value.length === 1)
                ? null : (
                  <div className="bg-lm-1 dark:bg-dm-1 px-2 py-2 flex justify-between group-hover/itemItem:opacity-100">
                    <div>
                      <ConfirmButton icon="delete" title={schema.deleteTitleText} color="warning" onClick={() => onRemoveItemClicked(item._id)} />
                    </div>
                    <div className="flex items-center">
                      {(index !== 0) && (
                        <FlatButton icon="sortUp" title="Sort up" onClick={() => onSortItemUpClicked(index)} />
                      )}
                      {(index !== value.length - 1) && (
                        <FlatButton icon="sortDown" title="Sort down" className="ml-3" onClick={() => onSortItemDownClicked(index)} />
                      )}
                    </div>
                  </div>
                )}
            </div>
          );
        })}
      </div>
      <div className="inline-flex">
        <Button icon="create" color="secondary" className="rounded-t-none" text={schema.addButtonText} onClick={onAddItemClicked} />
      </div>
    </div>
  );
};

export default ArrayFormField;