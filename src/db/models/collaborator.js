'use strict';
module.exports = (sequelize, DataTypes) => {
  const Collaborator = sequelize.define('Collaborator', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Collaborator.associate = function(models) {
    // associations can be defined here
    Collaborator.belongsTo(models.Wiki, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });
    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  Collaborator.addScope("collaboratorsFor", (userId) => {
     return {
       include: [{
         model: models.Wiki
       }],
       where: { userId: userId},
       order: [["createdAt", "DESC"]]
     }
   });
   Collaborator.addScope("collaborationsFor", (wikiId) => {
      return {
        include: [{
          model: models.User
        }],
        where: { wikiId: wikiId},
        order: [["createdAt", "DESC"]]
      }
    });
  };
  return Collaborator;
};
