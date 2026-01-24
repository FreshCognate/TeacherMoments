import addModal from '~/core/dialogs/helpers/addModal';
import axios from 'axios';
import handleRequestError from '~/core/app/helpers/handleRequestError';

interface Router {
  navigate: (path: string) => void;
}

interface OpenCreateScenarioModalProps {
  router: Router;
}

const openCreateScenarioModal = ({ router }: OpenCreateScenarioModalProps) => {
  addModal({
    title: 'Create scenario',
    schema: {
      name: {
        type: 'Text',
        label: 'Scenario name',
        shouldAutoFocus: true
      },
      accessType: {
        type: 'Toggle',
        label: 'Access type',
        options: [{
          value: 'PRIVATE',
          text: 'Private'
        }, {
          value: 'PUBLIC',
          text: 'Public'
        }]
      }
    },
    model: {
      name: '',
      accessType: 'PRIVATE'
    },
    actions: [{
      type: 'CANCEL',
      text: 'Cancel'
    }, {
      type: 'CREATE',
      text: 'Create',
      color: 'primary'
    }]
  }, (state: string, { type, modal }: { type: string, modal: any }) => {
    if (state === 'ACTION') {
      if (type === 'CREATE') {
        axios.post('/api/scenarios', modal).then((response) => {
          const { scenario } = response.data;
          router.navigate(`/scenarios/${scenario._id}/create`);
        }).catch(handleRequestError);
      }
    }
  });
};

export default openCreateScenarioModal;
