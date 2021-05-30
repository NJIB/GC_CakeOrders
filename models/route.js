module.exports = function(sequelize, DataTypes) {
    const Route = sequelize.define('Route', {
      hurdle: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      markets: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      buyers: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      offerings: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      productivity: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      acquisition: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1],
        },
      },
    });
  
    Route.associate = function(models) {
      // We're saying that a OrderDetail should belong to an Order
      // A OrderDetail can't be created without an Order due to the foreign key constraint
      Route.belongsTo(models.Order, {
        foreignKey: {
          allowNull: false,
        },
      });
    };
  
    return Route;
  };