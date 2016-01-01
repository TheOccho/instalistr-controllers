module.exports = {
  controllers: {
    list: require('./controllers/list'),
    location: require('./controllers/location'),
    post: require('./controller/post'),
    user: require('./controllers/user')
  },
  models: {
    list: require('./models/list'),
    location: require('./models/location'),
    post: require('./models/post'),
    user: require('./models/user')
  }
};
