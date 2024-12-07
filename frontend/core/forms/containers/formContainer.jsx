import React, { Component } from 'react';
import Form from '../components/form';
import testConditions from '../helpers/testConditions';
import testValidators from '../helpers/testValidators';
import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';
import has from 'lodash/has';

class FormContainer extends Component {

  state = {
    formState: {},
    hasInitialised: false,
  };

  componentDidMount = () => {

    this.setupForm();

  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.renderKey !== this.props.renderKey) {
      this.setupForm();
    }
  };

  setupForm = () => {
    const formState = {};
    const { schema, model } = this.props;
    each(schema, (schemaValue, schemaKey) => {
      const { hasCondition, condition, shouldHideField } = testConditions(schemaKey, schemaValue, model);
      const { hasError, error } = testValidators(schemaKey, schemaValue, model);
      if (hasError && !this.hasFormError) {
        this.hasFormError = true;
        this.errorField = schemaKey;
        this.formError = error;
      }

      formState[schemaKey] = {
        isDirty: false,
        hasError,
        error,
        hasCondition,
        condition,
        shouldHideField,
      };

    });

    this.setState({ formState, hasInitialised: true });

    if (this.props.onLoad) {
      this.props.onLoad({
        formState,
        hasError: this.hasFormError,
        errorField: this.errorField,
        error: this.formError,
      });
    }

  };

  onUpdateField = ({ update, callback }) => {

    const { model, schema, onUpdate } = this.props;

    this.hasFormError = false;
    this.formError = null;
    this.errorField = null;

    const preemptedModel = cloneDeep(model);

    each(update, (updateValue, updateKey) => {
      if (this.state.formState[updateKey]) {
        preemptedModel[updateKey] = updateValue;
      }
    });

    each(preemptedModel, (updateValue, updateKey) => {

      if (this.state.formState[updateKey]) {
        const schemaValue = schema[updateKey];
        const { hasCondition, condition, shouldHideField } = testConditions(updateKey, schemaValue, preemptedModel);
        const { hasError, error } = testValidators(updateKey, schemaValue, preemptedModel);
        if (hasError && !this.hasFormError) {
          this.hasFormError = true;
          this.errorField = updateKey;
          this.formError = error;
        }
        this.state.formState[updateKey].hasError = hasError;
        this.state.formState[updateKey].error = error;
        this.state.formState[updateKey].hasCondition = hasCondition;
        this.state.formState[updateKey].condition = condition;
        this.state.formState[updateKey].shouldHideField = shouldHideField;

        if (has(update, updateKey)) {
          this.state.formState[updateKey].isDirty = true;
        }
      }
    });

    const { formState } = this.state;

    this.setState({ formState });

    return onUpdate({
      update,
      formState,
      hasError: this.hasFormError,
      errorField: this.errorField,
      error: this.formError,
      callback
    });
  };

  render() {
    //if (!this.state.hasInitialised) return null;

    const {
      title,
      model,
      schema,
      form,
      size,
      renderKey,
    } = this.props;

    return (
      <Form
        title={title}
        model={model}
        schema={schema}
        form={form || {}}
        size={size}
        state={this.state.formState}
        renderKey={renderKey}
        onUpdateField={this.onUpdateField}
      />
    );
  }
};

export default React.memo(FormContainer);