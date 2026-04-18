import htmlToSlate from './htmlToSlate.js';
import buildSlateFromText from './buildSlateFromText.js';

export default function mapComponent(component, sortOrder) {
  const type = component.type || 'Unknown';
  const result = { blockType: 'TEXT', sortOrder, images: [] };

  switch (type) {

    case 'Text': {
      const { slate, images } = htmlToSlate(component.html);
      result.blockType = 'TEXT';
      result.fields = { 'en-US-body': slate };
      result.images = images;
      break;
    }

    case 'MultiButtonResponse': {
      result.blockType = 'MULTIPLE_CHOICE_PROMPT';
      result.fields = {
        'en-US-body': buildSlateFromText(component.prompt),
        isRequired: !!component.required,
        isMultiSelect: false,
        options: (component.buttons || []).map(btn => ({
          'en-US-text': btn.display || btn.value || '',
          value: btn.value || '',
        })),
      };
      result.responseId = component.responseId;
      result.recallId = component.recallId;
      break;
    }

    case 'AudioResponse': {
      result.blockType = 'INPUT_PROMPT';
      result.fields = {
        'en-US-body': buildSlateFromText(component.prompt || component.header),
        inputType: 'AUDIO',
        isRequired: !!component.required,
      };
      result.responseId = component.responseId;
      result.recallId = component.recallId;
      break;
    }

    case 'TextResponse': {
      result.blockType = 'INPUT_PROMPT';
      result.fields = {
        'en-US-body': buildSlateFromText(component.prompt),
        'en-US-placeholder': component.placeholder || '',
        inputType: 'TEXT',
        isRequired: !!component.required,
      };
      result.responseId = component.responseId;
      result.recallId = component.recallId;
      break;
    }

    case 'AudioPrompt': {
      result.blockType = 'INPUT_PROMPT';
      result.fields = {
        'en-US-body': buildSlateFromText(component.prompt),
        inputType: 'AUDIO',
        isRequired: !!component.required,
      };
      result.responseId = component.responseId;
      break;
    }

    case 'ResponseRecall': {
      result.blockType = 'RESPONSE';
      result.fields = {};
      result.pendingRecallId = component.recallId;
      break;
    }

    case 'MultiPathResponse': {
      result.blockType = 'ACTIONS_PROMPT';
      result.fields = {
        'en-US-body': buildSlateFromText(component.prompt),
        actions: (component.paths || []).map(path => ({
          'en-US-text': path.display || '',
          actionType: 'COMPLETE_SLIDE',
          actionValue: String(path.value),
        })),
      };
      result.responseId = component.responseId;
      result.pendingSlideRefs = (component.paths || []).map(path => path.value);
      break;
    }

    case 'Suggestion': {
      const { slate, images } = htmlToSlate(component.html);
      result.blockType = 'SUGGESTION';
      result.fields = {
        'en-US-body': slate,
        suggestionType: 'INFO',
      };
      result.images = images;
      break;
    }

    case 'ConditionalContent': {
      const innerHtml = (component.component && component.component.html) || component.html || '';
      const { slate, images } = htmlToSlate(innerHtml);
      result.blockType = 'TEXT';
      result.fields = { 'en-US-body': slate };
      result.images = images;
      break;
    }

    case 'ChatPrompt': {
      result.blockType = 'TEXT';
      result.fields = {
        'en-US-body': buildSlateFromText(component.prompt || 'Chat prompt (migrated)'),
      };
      break;
    }

    case 'AnnotationPrompt': {
      result.blockType = 'TEXT';
      result.fields = {
        'en-US-body': buildSlateFromText(component.question || 'Annotation prompt (migrated)'),
      };
      break;
    }

    case 'ConversationPrompt': {
      result.blockType = 'TEXT';
      result.fields = {
        'en-US-body': buildSlateFromText(component.prompt || 'Conversation prompt (migrated)'),
      };
      break;
    }

    default: {
      result.blockType = 'TEXT';
      result.fields = {
        'en-US-body': buildSlateFromText(component.html || component.prompt || `Unknown component type: ${type}`),
      };
      break;
    }
  }

  return result;
}
