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
  const Model = mongoose.model(config.mongodb.proxyResponseCollection, schema);

  function save(proxiedResponse) {
    const proxiedResponseModel = new Model();
    Object.assign(proxiedResponseModel, { ...proxiedResponse, timestamp: new Date() });
    return proxiedResponseModel.save()
      .then((savedProxiedResponse) => savedProxiedResponse.toJSON());
  }

  function findOne(query) {
    return Model.findOne(query)
      .then((proxiedResponse) => proxiedResponse && proxiedResponse.toJSON())
      .catch((err) => winston.error('Unable to find proxied response', err));
  }

  function find(query) {
    return Model.find(query)
      .then((proxiedResponses) => proxiedResponses.map((proxiedResponse) => proxiedResponse.toJSON()));
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
