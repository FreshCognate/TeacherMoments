import React, { Component } from 'react';
import CreateStaticSlideEditor from '../components/createStaticSlideEditor';
import WithCache from '~/core/cache/containers/withCache';
import editConsentSchema from '../schemas/editConsentSchema';
import editSummarySchema from '../schemas/editSummarySchema';

class CreateStaticSlideEditorContainer extends Component {

  getSchema = () => {
    const { type } = this.props;
    if (type === 'CONSENT') return editConsentSchema;
    if (type === 'SUMMARY') return editSummarySchema;
    return {};
  }

  getTitle = () => {
    const { type } = this.props;
    if (type === 'CONSENT') return 'Consent Agreement';
    if (type === 'SUMMARY') return 'Summary';
    return '';
  }

  onUpdateScenario = ({ update }) => {
    return this.props.scenario.mutate(update, { method: 'put' });
  }

  render() {
    const { data, status } = this.props.scenario;
    return (
      <CreateStaticSlideEditor
        schema={this.getSchema()}
        scenario={data}
        title={this.getTitle()}
        isLoading={status === 'loading' || status === 'unresolved'}
        onUpdate={this.onUpdateScenario}
      />
    );
  }
};

export default WithCache(CreateStaticSlideEditorContainer, null, ['scenario']);
