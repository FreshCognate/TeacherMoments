import TextBlockPlayerContainer from '~/modules/blocks/containers/textBlockPlayerContainer';
import ImagesBlockPlayerContainer from '~/modules/blocks/containers/imagesBlockPlayerContainer';
import MediaBlockPlayerContainer from '~/modules/blocks/containers/mediaBlockPlayerContainer';
import SuggestionBlockPlayerContainer from '~/modules/blocks/containers/suggestionBlockPlayerContainer';
import ResponseBlockPlayerContainer from '~/modules/blocks/containers/responseBlockPlayerContainer';
import AnswersPromptBlockPlayerContainer from '~/modules/blocks/containers/answersPromptBlockPlayerContainer';
import ActionsPromptBlockPlayerContainer from '~/modules/blocks/containers/actionsPromptBlockPlayerContainer';
import InputPromptBlockPlayerContainer from '~/modules/blocks/containers/inputPromptBlockPlayerContainer';

const BLOCK_MAPPINGS = {
  "TEXT": TextBlockPlayerContainer,
  "IMAGES": ImagesBlockPlayerContainer,
  "MEDIA": MediaBlockPlayerContainer,
  "SUGGESTION": SuggestionBlockPlayerContainer,
  "RESPONSE": ResponseBlockPlayerContainer,
  "ANSWERS_PROMPT": AnswersPromptBlockPlayerContainer,
  "INPUT_PROMPT": InputPromptBlockPlayerContainer,
  "ACTIONS_PROMPT": ActionsPromptBlockPlayerContainer
}

export default ({ blockType }) => {
  return BLOCK_MAPPINGS[blockType];
}