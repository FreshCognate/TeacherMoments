import createSlide from "../../slides/services/createSlide.js";

export default async (props, options, context) => {

  const { name } = props;
  const { models, user } = context;

  if (!name) throw { message: "A cohort must have a name", statusCode: 400 };

  const newCohortObject = {
    name,
    createdBy: user._id,
    collaborators: [{
      user: user._id,
      role: 'OWNER'
    }]
  };

  const cohort = await models.Cohort.create(newCohortObject);

  return cohort;

};