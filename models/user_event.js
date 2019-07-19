'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_event = sequelize.define('User_event', {
    userId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    requestedPrice: DataTypes.DOUBLE,
    fulfilled: DataTypes.BOOLEAN
  }, {});
  User_event.associate = function(models) {
    // associations can be defined here
    User_event.belongsTo(models.User, {foreignKey: 'userId'})
    User_event.belongsTo(models.Event, {foreignKey: 'eventId'})

  };
  return User_event;
};