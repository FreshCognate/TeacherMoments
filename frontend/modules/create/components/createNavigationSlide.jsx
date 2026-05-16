import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import CreateNavigationSlideActionsContainer from '../containers/createNavigationSlideActionsContainer';
import map from 'lodash/map';
import getBlockComponent from '~/modules/blocks/helpers/getBlockComponent';
import CreateStemsContainer from '../containers/createStemsContainer';
import Flag from '~/modules/flags/components/flag';
import Badge from '~/uikit/badges/components/badge';

const CreateNavigationSlide = ({
  scenarioId,
  slide,
  slideBlocks,
  slideTriggers,
  draggingOptions = {},
  isSelected,
  isDeleting,
  isDuplicating,
  canDeleteSlides,
  hasChildStems,
  onDuplicateSlideClicked,
  onDeleteSlideClicked,
  onCreateStemClicked
}) => {

  const { setNodeRef, style, attributes, listeners, isDragging } = draggingOptions;

  const className = classnames("bg-lm-0 shadow-sm dark:bg-dm-0 rounded-md h-36 mb-2 relative border border-lm-3 dark:border-dm-2", {
    "outline outline-blue-500": isSelected,
    "opacity-50": isDeleting || isDragging || isDuplicating
  });

  return (
    <div>

      <Link to={`/scenarios/${scenarioId}/create?slide=${slide._id}`} replace>
        <div className={className} style={style} ref={setNodeRef} {...listeners} {...attributes}>
          <CreateNavigationSlideActionsContainer
            slide={slide}
            slideNumber={slide.sortOrder + 1}
            canDeleteSlides={canDeleteSlides}
            onDuplicateSlideClicked={() => onDuplicateSlideClicked(slide._id)}
            onDeleteSlideClicked={() => onDeleteSlideClicked(slide._id)}
            onCreateStemClicked={() => onCreateStemClicked()}
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
            <div className="absolute bottom-1 w-full flex justify-between">
              <span>
                {(slideTriggers.length > 0) && (
                  <Badge icon="trigger" size='sm' />
                )}
              </span>
              <span>
                {(hasChildStems) && (
                  <Badge icon="branching" />
                )}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <Flag>
        <CreateStemsContainer slideRef={slide.ref} />
      </Flag>
    </div>
  );
};

export default CreateNavigationSlide;