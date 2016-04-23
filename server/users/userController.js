var User = require('./userModel.js');
var Q = require('q');
var jwt = require('jwt-simple');

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);
var findUserById = Q.nbind(User.findById, User);
var findUsers = Q.nbind(User.find, User);

module.exports = {
  signin: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    
    findUser({username: username})
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.encode(user, 'route66');
                res.json({token: token});
              } else {
                return next(new Error('No User'));
              }
            });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },
  
  signup: function(req, res, next) {
    var username = req.body.username;
    //var password = req.body.password;
    
    findUser({username: username})
      .then(function(user) {
        if (user) {
          next(new Error('User already exists'));
        } else {
          return createUser(req.body);
        }
      })
      .then(function(user) {
        // create token to send back for authorization
        var token = jwt.encode(user, 'route66');
        res.json({token: token});
      })
      .fail(function(error) {
        next(error);
      });
  },
  sendFriendRequest: function (req, res) {
    // Grab user token, get the users ID
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66');
    var userID = user._id;
    var friendID = req.body._id; 
    findUserById(friendID)
      .then(function (friendToBe) {
        if(friendToBe) { 
          friendToBe.pending.push(userID);
          friendToBe.save();
          res.send({sucess: "Friend Request Sent" });
        }
      });
  },
  handleFriendRequest: function (req, res) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66'); 
    var accepted  = req.body.accepted;  
    var friendID = req.body._id;
    var currentUser; 
    var userID = user._id; 
    var friendToBe; 
    findUserById(userID)
      .then(function (user) { 
        if(user) {
          currentUser = user;
          var index = currentUser.pending.indexOf(friendID);
          currentUser.pending.slice(index, 1);
          currentUser.save();
        }
      });
    if (accepted ===true) {
      findUserById(friendID)
        .then(function (user) {
            friendToBe = user;
            currentUser.friends.push(friendID);
            friendToBe.friends.push(userID);
            user.save();
            friendToBe.save();
        });
    }
  },
  sendNonFriendUsers: function (req, res) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66');
    var userID = user._id;
    var currentUser;
    findUserById(userId)
      .then(function (user) {
        if(user) {
          currentUser = user;
        }
      });

    findUsers({})
      .then(function (users) {
        var nonFriendUsers;
        if(users) {
          nonFriendUsers =  users.filter(function (user) {
            if(!currentUser.friends.includes(user)) {
              return user;
            }
          });
          res.send(nonFriendUsers);
        }
      });
  },
  checkAuth: function(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token) {
      next(new Error('No token'));
    } else {
      var user = jwt.decode(token, 'route66');
      findUser({username: user.username})
        .then(function(foundUser) {
          if (foundUser) {
            res.status(200).send({ username: foundUser.username });
          } else {
            res.send(401);
          }
        })
        .fail(function(error) {
          next(error);
        });
    }
  },

  errorHandler: function (error, req, res, next) {
    res.status(500).send({error: error.message});
  }
};