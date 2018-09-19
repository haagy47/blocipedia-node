const Collaborator = require("./models").Collaborator;
const Wiki = require("./models").Wiki;
const User = require("./models").User;

const Authorizer = require("../policies/collaborator");

module.exports = {

  getCollaborators(id, callback) {
    let result = {};
    Wiki.findById(id)
    .then((wiki) => {
      if(!wiki) {
        callback(404);
      } else {
        result["wiki"] = wiki;
        Collaborator.scope({method: ["collaboratorsFor", id]}).all()
        .then((collaborators) => {
          result["collaborators"] = collaborators;
          callback(null, result);
          })
          .catch((err) => {
            callback(err);
          })
      }
    })
  },

  createCollaborator(req, callback){
    if (req.user.username == req.body.collaborator){
          return callback("Cannot add yourself to collaborators!");
        }
        User.findAll({
          where: {
            username: req.body.collaborator
          }
        })
        .then((users)=>{
          if(!users[0]){
            return callback("User not found.");
          }
          Collaborator.findAll({
            where: {
              userId: users[0].id,
              wikiId: req.params.wikiId,
            }
          })
          .then((collaborators)=>{
            if(collaborators.length != 0){
              return callback(`${req.body.collaborator} is already a collaborator on this wiki.`);
            }
            let newCollaborator = {
              userId: users[0].id,
              wikiId: req.params.wikiId
            };
            return Collaborator.create(newCollaborator)
            .then((collaborator) => {
              callback(null, collaborator);
            })
            .catch((err) => {
              callback(err, null);
            })
          })
          .catch((err)=>{
            callback(err, null);
          })
        })
        .catch((err)=>{
          callback(err, null);
        })
    /*
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
          console.log('error! This collaborator already exists');
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
    */
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
