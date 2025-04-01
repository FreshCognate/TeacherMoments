import axios from 'axios';
import get from 'lodash/get';
import '~/core/app/containers/textAreaContainer.formField';
import '~/core/app/containers/arrayContainer.formField';
import '~/core/app/components/text.formField';
import '~/core/app/components/toggle.formField';
import '~/core/app/components/select.formField';
import '~/core/app/components/alert.formField';
import '~/modules/triggers/containers/triggerBlocksSelectorContainer.formField';
import '~/modules/assets/containers/assetSelectorContainer.formField';
import '~/modules/blocks/containers/responseSelectorContainer.formField';
import '~/modules/slides/containers/slideNavigationContainer.formField';
import '~/core/app/conditions/modelValueIs';
import '~/modules/slides/helpers/isRootSlide.condition';
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