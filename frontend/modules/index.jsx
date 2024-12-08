import axios from 'axios';
import get from 'lodash/get';
import '~/core/app/components/text.formField';
import '~/core/app/containers/textAreaContainer.formField';
import '~/core/app/components/toggle.formField';
import '~/modules/ls/helpers/ls.condition'

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  const data = get(error, 'response.data', {});
  if (data.statusCode === 401 && data.isLoginRequired) {
    if (typeof window !== 'undefined') {
      window.location = '/';
      return;
    }
  }
  if (data.statusCode === 401 && data.shouldRedirectToPortal) {
    if (typeof window !== 'undefined') {
      window.location = `/`;
      return;
    }
  }
  return Promise.reject(error);
});