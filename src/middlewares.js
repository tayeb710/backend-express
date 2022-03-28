const isBefore = require('date-fns/isBefore');
const { User } = require('./models/User');
const { AuthToken } = require('./models/AuthToken');



module.exports.authMiddleware = ({
  onlyGuests = true,
  onlyAuthenticated = false,
 }) => async (req, res, next) => {


  // token from headers
  const token = req.headers.Authorization || req.headers.authorization || '';

  // try the database
  try {
    debugger
    const authToken = await AuthToken.findOne({
      where: {
        token,
      },
    });
    if (!authToken) {
      if (onlyAuthenticated) {
        // console.log('401 1');
        res.status(401).send({message: 'should be authenticated'});
        return;
      }

      next();
      return;
    }

    req.authToken = authToken;

    if (isBefore(authToken.expiresAt, new Date())) {
      authToken.status = 'expired';
      await authToken.save();
      // console.log('401 2');
      res.status(401).send({});
      return;
    }

    try {
      req.currentUser = await User.findOne({where:{ id: authToken.userId }});
      console.log(authToken.id,authToken.userId,req.currentUser.id)
    } catch (e) {
      console.log('apiMiddleware: user not found');
      res.status(401).send({});
      return;
    }

    if (onlyGuests) {
      res.status(403).send({message: 'only guests'});
      return;
    }
    next();
  } catch (err) {
    console.error(err);
    if (onlyAuthenticated) {
      // console.log('401 3');
      res.status(401).send({});
      return;
    }
    next(err);
  }

};


