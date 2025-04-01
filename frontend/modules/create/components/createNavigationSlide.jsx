import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import CreateNavigationSlideActionsContainer from '../containers/createNavigationSlideActionsContainer';
import map from 'lodash/map';
import getBlockComponent from '~/modules/blocks/helpers/getBlockComponent';

const CreateNavigationSlide = ({
  scenarioId,
  slide,
  slideBlocks,
  draggingOptions = {},
  isSelected,
  isDeleting,
  onDeleteSlideClicked
}) => {

  const { setNodeRef, style, attributes, listeners, isDragging } = draggingOptions;

  const className = classnames("bg-lm-2 dark:bg-dm-2 rounded-md h-36 mb-2 relative", {
    "outline outline-blue-500": isSelected,
    "opacity-50": isDeleting || isDragging
  });

  return (
    <Link to={`/scenarios/${scenarioId}/create?slide=${slide._id}`}>
      <div className={className} style={style} ref={setNodeRef} {...listeners} {...attributes}>
        <CreateNavigationSlideActionsContainer
          onDeleteSlideClicked={() => onDeleteSlideClicked(slide._id)}
        />
        <div>

          <div className="overflow-hidden h-28 rounded-b-lg">

            <svg xmlns="http://www.w3.org/2000/svg" width="640" height="1000">
              <foreignObject transform={'scale(0.376)'} width={'100%'} height={'100%'}>
                <section>
                  {map(slideBlocks, (block) => {
                    let Block = getBlockComponent({ blockType: block.blockType });
                    return (
                      <div
                        key={block._id}
                        className="mb-8 last:mb-0 p-4"
                      >
                        <Block
                          block={block}
                          blockTracking={{}}
                        />
                      </div>
                    );
                  })}
                </section>
              </foreignObject>
              <rect
                x="0"
                y="0"
                fill="transparent"
                transform={'scale(1)'}
                width={'100%'}
                height={'100%'}
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CreateNavigationSlide;