const axios = require('axios');
const Joi = require('joi');

const catchAsync = require('../utils/catchAsync');


const schema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  monthlyGoal: Joi.string().required(),
  quarterlyGoal: Joi.string().required(),
  biannualGoal: Joi.string().required(),
  annualGoal: Joi.string().required(),
  achieved: Joi.boolean().required(),
  createdBy: Joi.date().required(),
});

exports.getAllGoals = catchAsync(async (req, res, next) => {
  const collectionName = 'goals';

  // for zuri core live API
  // const baseUrl = 'https://zccore.herokuapp.com';
  // const pluginId = '2333434324defef34';
  // const organizationId = '333feafdefwd34434';
  // const url = `${baseUrl}/data/read/${pluginId}/${collectionName}/${organizationId}`;

  // fake API
  const url = `https://test-zuri-core.herokuapp.com/crud/${collectionName}/find`;
  const result = await axios.get(url);
  res.status(200).json(result.data);
})

exports.createGoals = catchAsync(async (req, res, next) => {
  // Validating each property against their data type
  await schema.validateAsync(req.body);

  // Fake API
  // https://api.zuri.chat/data/write
  //const goals = await axios.post(`https://test-zuri-core.herokuapp.com/crud/goals/insert-one`, req.body);

  const goals = await axios.post(`https://zccore.herokuapp.com/data/write`,
  {
    plugin_id: "61330fcfbfba0a42d7f38e59",
    organization_id: "1",
    collection_name: "goals",
    bulk_write: false,
    payload: req.body
  })

  //console.log(goals);

  // Sending Responses
  res.status(200).json(goals.data);
});

exports.getSingleGoal = catchAsync(async (req, res, next) => {
  const goalId = req.params.id;
  const collectionName = 'goals';

  // for zuri core live API
  const baseUrl = 'https://zccore.herokuapp.com';
  const pluginId = '61330fcfbfba0a42d7f38e59';
  const organizationId = '1'; // Would be gotten from zuri main
  const url = `${baseUrl}/data/read/${pluginId}/${collectionName}/${organizationId}`;

  const result = await axios.get(url, { params: { _id: goalId } });
  const status = result.status || 200;
  const data = result.data.data[0];
  res.status(status).json({ status: status, message: 'success', data: data });
});

exports.createGoal = catchAsync(async (req, res, next) => {
  await res.status(201).send({
    message: 'Success, Goal Created',
    data: {
      title: 'Goal',
      description: 'This is a quarterly goal',
      weeklyGoal: 'false',
      monthlyGoal: 'false',
      quarterlyGoal: 'true',
      biannualGoal: 'false',
      annualGoal: 'false',
      achieved: 'false',
      createdBy: 'HR',
      createdAt: 'Wed Sep 3 2020 01:00:00 GMT+0100(WAT)',
      updatedAt: 'Wed Sep 3 2020 01:00:00 GMT+0100(WAT)',
    },
  });
});

exports.updateSingleGoalById = catchAsync(async (req, res, next) => {
  // First, Get update from req.body
  const goalId = req.params.id;
  const collectionName = 'goals';

  // Then, send update to zuri core
  const url = `https://test-zuri-core.herokuapp.com/crud/${collectionName}/${goalId}`;
  const result = await axios.patch(url, req.body);

  // Finally, send the updated goal to client.
  res.status(200).json(result.data);
})
