import React from 'react';
import CreateSortableItem from './createSortableItem';
import map from 'lodash/map';
import CreateDropzone from './createDropzone';

const CreateDroppable = ({
  id,
  items,
  data,
  renderItem
}) => {
  return (
    <div className="relative">
      <CreateDropzone
        id={id}
        data={data}
        sortOrder={0}
      />
      {map(items, (item, index) => {
        return (
          <CreateSortableItem
            key={item._id}
            id={item._id}
            items={items}
            index={index}
            item={item}
            data={data}
            renderItem={renderItem}
          />
        );
      })}
    </div>
  );
};

export default CreateDroppable;