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
  purgeReqs: function(req, res) {
    var username = req.body.username;
    findUser({username: username})
      .then(function(user){
        var pending = user.pending;
        var purged = pending.filter(function(item) {
          return typeof item === 'object';
        });
        user.pending = purged;
        user.save(function(err) {
          if(err) res.send(err);
          else res.send("PURGED! AND IT FEELS SO GOOD!", user);
        });
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
        var pending = friendToBe.pending; 
        var contains = pending.find(function(req) {
          return req._id === userID;
        });
        if(!contains) {
          friendToBe.pending.push(user);
          friendToBe.save();
          res.send({sucess: "Friend Request Sent" });  
        } else {
          res.send({failure: "You've already requested this friend!"});
        }
      });
  },
  handleFriendRequest: function (req, res) {
    var token = req.headers['x-access-token'];
    var responder = jwt.decode(token, 'route66');
    var responderID = responder._id;
    var requesterID = req.body._id;
    var accepted = req.body.accepted;
    findUserById(responderID)
      .then(function (user) {
        if(user) {
          var currentUser = user;
          var pending = currentUser.pending; 
          var index = function () {
            for(var i = 0, len = pending.length; i < len; i++) {
              console.log("IN LOOP", pending[i]._id === requesterID);
              if (pending[i]._id === requesterID) return i;
            }
            return -1;
          }();
          if(index > -1) {
            currentUser.pending.splice(index, 1);
          }
          currentUser.save(function(){
            if(!accepted) res.send({message:"Request Handled!"});
          });
        }
        if (accepted) {
          findUserById(requesterID)
            .then(function (user) {
                friendToBe = user;
                currentUser.friends.push(requesterID);
                friendToBe.friends.push(responderID);
                currentUser.save(function() {
                  friendToBe.save(function(){
                    res.send({message:"Request Handled!"});
                  });          
                });
            });
        }
      });
  },
  sendNonFriendUsers: function (req, res) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66');
    var userID = user._id;
    var currentUser;
    findUser({_id:userID}).then(function(user) {
      currentUser = user;
      findUsers({_id:{ $nin: currentUser.friends }})
        .then(function (users) {
          console.log(users);
          res.send(users);
        });
    });
  },
  getProfile: function (req, res) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66');
    var userID = user._id;
    findUserById(userID)
      .then(function (user) {
        res.status(200).send(user);
      });
  },
  getFriends: function (req, res) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66');
    var userID = user._id;
    findUsers({_id: { $in: user.friends}})
      .then(function (friends) {
        friends = friends.map(function (friend) {
          return friend.username;
        })
        res.send(friends);
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

  getNotifications: function(req, res) {
    var token = req.headers['x-access-token'];
    var user = jwt.decode(token, 'route66');
    findUser({username: user.username})
      .then(function(user) {
        res.status(200).send(user.pending);
      });
  },

  errorHandler: function (error, req, res, next) {
    res.status(500).send({error: error.message});
  }
};