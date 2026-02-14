import getCache from '~/core/cache/helpers/getCache';

const setEditingMode = () => {
  const editor = getCache('editor');
  editor.set({ displayMode: 'EDITING' });
  const run = getCache('run');
  run.reset();
};

export default setEditingMode;
