const express = require('express');
const randomstring = require('randomstring');
const { AuthToken } = require('../models/AuthToken');
const { User } = require('../models/User');
const { authMiddleware } = require('../middlewares');
const { addDays } = require('date-fns');


const router = express.Router();

router.post(
  '/sign-in',
  authMiddleware({ onlyGuests: true }),
  async (req, resp) => {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });

    // user not found
    if (!user) return resp.status(422).send('user not found');

    // wrong password
    if (!(await user.validatePassword(password))) {
      return resp.status(422).end('wrong password');
    }


    // create auth token
    // login the user
    const authToken = await AuthToken.create({
      token: randomstring.generate(),
      expiresAt: addDays(new Date(), 30),
      userId: user.id,
    });

    resp.status(200).send({ authToken });
  }
);

router.get(
  '/get-current-user',
  authMiddleware({ onlyGuests: false  }),
  async (req, resp) => {
    

   resp.status(200).send({ currentUser: req.currentUser });
  }
);

router.post(
  '/sign-up-user',
  authMiddleware({ onlyGuests: true }),
  async (req, resp) => {
    const {
      body: {
        firstname,
        lastname,
        password,
        email,
        type
      },
    } = req;

    

    // check email uniqueness
    const userWithTheSameEmail = await User.findOne({
      where: {
        email
      },
    });
   
    if (userWithTheSameEmail ) {
      return resp.status(422).send({ errors: { email: 'duplicate' } });
    }

    let user;

      try {
        // create user
        user = await User.create({
          firstname,
          lastname,
          password: User.hashPassword(password),
          email,
          type
        });
      } catch (e) {
        return resp.status(422).end();
      }

    // create auth token
    const authToken = await AuthToken.create({
      token: randomstring.generate(),
      expiresAt: addDays(new Date(), 30),
      userId: user.id,
    });

    const dbUser = await User.scope('withoutPassword').findOne({
      where: {
        id: user.id,
      },
    });

    resp.send({ user: dbUser, authToken });
  }
);








module.exports = router;
