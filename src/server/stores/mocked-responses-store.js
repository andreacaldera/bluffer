import winston from 'winston';
// import { omit } from 'lodash';

import config from '../config';

const schema = {
  url: String, // TODO unique?
  responseBody: String,
  timestamp: Date,
  httpMethod: String,
  contentType: String,
  proxyId: Number,
};

export default ({ mongoose }) => {
  const Model = mongoose.model(config.mongodb.mockCollection, schema);

  function findOne(query) {
    return Model.findOne(query)
      .then((mockedResponse) => mockedResponse && mockedResponse.toJSON())
      .catch((err) => winston.error('Unable to find mocked response', err));
  }

  function save(mockedResponse) {
    return Model.findOneAndUpdate(
      { url: mockedResponse.url, proxyId: mockedResponse.proxyId },
      { $set: { ...mockedResponse, timestamp: new Date() } },
      { new: true, upsert: true }
    );
  }

  // return findOne()
  //   .then((existingMockedResponse) => {
  //     if (existingMockedResponse) {
  //       const mockResponseModel = new Model();
  //       const test = omit(Object.assign(mockResponseModel, { ...mockedResponse, timestamp: new Date() }), '_id');
  //       return test.update()
  //         .then((savedMockedResponse) => savedMockedResponse.toJSON());
  //     }
  //

  function find(query) {
    return Model.find(query)
      .then((mockedResponses) => mockedResponses.map((mockedResponse) => mockedResponse.toJSON()));
  }

  function removeAll(proxyId) {
    return new Promise((resolve, reject) => {
      Model.remove({ proxyId }, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }

  function nuke() {
    return Model.remove();
  }

  return Object.freeze({
    save,
    findOne,
    find,
    removeAll,
    nuke: global.process.env.NODE_ENV === 'test' ? nuke : null,
  });
};
