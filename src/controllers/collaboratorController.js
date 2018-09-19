const express = require('express');
const router = express.Router();
const collaboratorQueries = require("../db/queries.collaborators.js");
const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application.js");

module.exports = {
  show(req, res, next){
    wikiQueries.getWiki(req.params.wikiId, (err, result) => {
        wiki = result["wiki"];
        collaborators = result["collaborators"];
        res.render("collaborators/show", {wiki, collaborators});
    });
        /*if(err || wiki == null){
          res.redirect(404, "/");
        } else {
        const authorized = new Authorizer(req.user, wiki, collaborators).edit();
        if(authorized){
            res.render("collaborators/collaborators", {wiki, collaborators});
        } else {
            req.flash("You are not authorized to do that.")
            res.redirect(`/wikis/${req.params.wikiId}`)
        }
      }*/
    /*collaboratorQueries.getAllCollaborators((err, collaborators) => {
        if(err){
          res.redirect(500, "wikis/private");
        } else {
          res.render(`/wikis/${wiki.id}/collaborators`, {collaborators});
        }
    })*/
  },
  create(req, res, next) {
    collaboratorQueries.createCollaborator(req, (err, collaborator) => {
      if(err){
        req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
  }
  /*create(req, res, next){
    //const authorized = new Authorizer(req.user).show();
    const authorized = new Authorizer(req.user).create();
    if(authorized) {
      let newCollaborator = {
        body: req.body.body,
        userId: req.user.id,
        wikiId: req.params.wikiId
      };

      collaboratorQueries.createCollaborator(newCollaborator, (err, collaborator) => {
        if(err){
          req.flash("error", err);
        }
        res.redirect(req.headers.referer);
      });
      } else {
          req.flash("notice", "You must be signed in to do that.")
          req.redirect("/users/sign_in");
        }
  },*/

  /*destroy(req, res, next){
    collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
      if(err){
        res.redirect(err, req.headers.referer);
      } else {
        res.redirect(req.headers.referer);
      }
    });
  }*/
}
