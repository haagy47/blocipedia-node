const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      const msg = {
        to: newUser.email,
        from: 'test@example.com',
        subject: 'Thanks for joining Blocipedia!',
        text: 'we are so glad you could join us',
        html: '<strong>start collaborating on wikis today!</strong>',
      };
      sgMail.send(msg);
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },
  upgrade(id, callback){
    return User.findById(id)
    .then((user) => {
        if(!user){
            return callback("This user doesn't exist");
        } else {
            return user.updateAttributes({role: "premium"});
        }
    })
    .catch((err) => {
        callback(err);
    })
  },
  getUser(id, callback) {
    let result = {};
    User.findById(id)
    .then((user) => {
      console.log(user);
        if(!user){
            callback(404);
        } else {
          result["user"] = user;
          Collaborator.scope({method: ["userCollaborationsFor", id]}).all()
          .then((collaborations) => {
              result["collaborations"] = collaborations;
              callback(null, result);
          })
          .catch((err) => {
              callback(err);
          })
        }
      })
  },
  downgrade(id, callback){
    return User.findById(id)
    .then((user) => {
        if(!user){
            return callback("This user doesn't exist");
        } else {
            return user.updateAttributes({role: 'standard'});
        }
    })
    .catch((err) => {
        callback(err);
    })
  }
}
