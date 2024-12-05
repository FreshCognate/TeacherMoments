const MODELS = [];

const registerModel = function ({ name, model, type, collection }) {
  MODELS.push({
    type,
    name,
    model,
    collection
  });
}

export {
  registerModel,
  MODELS
};