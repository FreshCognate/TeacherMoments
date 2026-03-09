import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';

interface Router {
  navigate: (path: string) => void;
}

interface OpenDuplicateScenarioModalProps {
  scenarioId: string;
  router: Router;
}

const openDuplicateScenarioModal = ({ scenarioId, router }: OpenDuplicateScenarioModalProps) => {
  addModal({
    title: 'Duplicate scenario',
    body: 'Are you sure you want to duplicate this scenario?',
    actions: [{
      type: 'CANCEL',
      text: 'Cancel'
    }, {
      type: 'CONFIRM',
      text: 'Duplicate',
      color: 'primary'
    }]
  }, (state: string, { type }: { type: string }) => {
    if (state === 'ACTION') {
      if (type === 'CONFIRM') {
        axios.post('/api/scenarios', { scenarioId }).then((response) => {
          const { scenario } = response.data;
          router.navigate(`/scenarios/${scenario._id}/create`);
        }).catch(handleRequestError);
      }
    }
  });
};

export default openDuplicateScenarioModal;
