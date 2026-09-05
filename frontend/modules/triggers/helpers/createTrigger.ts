import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';
import getCache from '~/core/cache/helpers/getCache';

interface CreateTriggerOptions {
  scenario: string;
  elementRef: string;
  action: string;
}

export default ({ scenario, elementRef, action }: CreateTriggerOptions) => {
  const triggers = getCache('triggers') as { fetch?: () => void };
  const triggerBaseModel = {
    scenario,
    elementRef,
    triggerType: 'SLIDE'
  };

  return axios.post('/api/triggers', { ...triggerBaseModel, action }).then(() => {
    if (triggers.fetch) {
      triggers.fetch();
    }
  }).catch(handleRequestError);
};
