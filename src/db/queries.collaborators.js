const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;

const Authorizer = require("../policies/collaborator");

module.exports = {

  getAllCollaborators(callback) {
    return Collaborator.all()

    .then((collaborators) => {
      callback(null, collaborators);
    })
    .catch((err) => {
      callback(err);
    })
  },

  createCollaborator(req, callback){
    User.findOne({
      where: {
        username: req.body.collaborator
      }
    })
    .then((user) => {
      if(!user){
        return callback("User does not exist")
      }
      Collaborator.findOne({
        where: {
          userId: user.id,
          wikiId: req.params.wikiId
        }
      })
      .then((collaborator) => {
        if(collaborator) {
          console.log('error!');
          return callback('This collaborator is already a collaborator on this wiki.')
        }
        let newCollaborator = {
          userId: user.id,
          wikiId: req.params.wikiId
        };
        console.log(newCollaborator);
        return Collaborator.create(newCollaborator)
        .then((collaborator) => {
          callback(null, collaborator);
        })
        .catch((err) => {
          callback(err, null);
        })
      })
    })
  },

  deleteCollaborator(req, callback){
    return Collaborator.findById(req.params.id)
    .then((collaborator) => {
      const authorized = new Authorizer(req.user, collaborator).destroy();

      if(authorized){
        collaborator.destroy();
        callback(null, collaborator)
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401)
      }
    })
  },

}
