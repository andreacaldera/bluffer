import winston from 'winston';

import config from '../config';

const schema = {
  url: String, // TODO unique?
  responseBody: String,
  client: String,
  timestamp: Date,
  httpMethod: String,
  contentType: String,
  proxyId: Number,
};

export default ({ mongoose }) => {
  const Model = mongoose.model(config.mongodb.mockCollection, schema);

  function save(mockedResponse) {
    const mockReasponseModel = new Model();
    Object.assign(mockReasponseModel, { ...mockedResponse, timestamp: new Date() });
    return mockReasponseModel.save()
      .then((savedMockedResponse) => savedMockedResponse.toJSON());
  }

  function findOne(query) {
    return Model.findOne(query)
      .then((mockedResponse) => mockedResponse && mockedResponse.toJSON())
      .catch((err) => winston.error('Unable to find mocked response', err));
  }

  function find(query) {
    return Model.find(query)
      .then((mockedResponses) => mockedResponses.map((mockedResponse) => mockedResponse.toJSON()));
  }


  return Object.freeze({
    save,
    findOne,
    find,
  });
};
