import includes from 'lodash/includes';

export default () => {
  return includes(['mit-tm.com', 'staging.teachermoments.org'], window.location.hostname);
}