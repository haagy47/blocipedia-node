const collaboratorQueries = require("../db/queries.collaborators.js");
const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/application.js");

module.exports = {
  show(req, res, next){
    wikiQueries.getWiki(req.params.wikiId, (err, result) => {
        wiki = result["wiki"];
        collaborators = result["collaborators"];
        if(err || wiki == null){
            res.redirect(404, "/");
        } else {
            const authorized = new Authorizer(req.user, wiki, collaborators).edit();
            if(authorized){
                res.render("collaborators/show", {wiki, collaborators});
            } else {
                req.flash("You are not authorized to do that.");
                res.redirect(`/wikis/${req.params.wikiId}`);
            }
        }
    });
    /*  collaboratorQueries.getCollaborators(req.params.wikiId, (err, result) => {
        wiki = result["wiki"];
        collaborators = result["collaborators"];
        if(err || wiki === null){
          req.flash("notice", "No wiki found");
          console.log(err);
          res.redirect("/");
        } else {
          res.render("collaborators/show", {wiki, collaborators});
        }
    });*/
  },
  create(req, res, next) {
    collaboratorQueries.createCollaborator(req, (err, collaborator) => {
      if(err){
        req.flash("error", err);
      }
      res.redirect(req.headers.referer);
    });
  },
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
