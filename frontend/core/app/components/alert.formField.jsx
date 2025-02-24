import registerField from '~/core/forms/helpers/registerField';
import Alert from '~/uikit/alerts/components/alert';

const AlertFormField = ({ schema }) => {
  return (
    <Alert
      type={schema.alertType}
      text={schema.alertText}
    />
  );
};

registerField('Alert', AlertFormField);