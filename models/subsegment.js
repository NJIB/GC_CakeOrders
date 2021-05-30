module.exports = function (sequelize, DataTypes) {
  const OrderDetail = sequelize.define('OrderDetail', {
    hurdle: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    markets: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    buyers: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    offerings: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    productivity: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    acquisition: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      //   validate: {
      //     len: [1, 160],
      //   },
      },
      RouteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      // //   validate: {
      // //     len: [1, 160],
      // //   },
      },
      // body: {
      //   type: DataTypes.TEXT,
      //   allowNull: false,
      //   validate: {
      //     len: [1],
      //   },
      // },
      // category: {
      //   type: DataTypes.STRING,
      //   defaultValue: 'Personal',
      //   allowNull: false,
      // },
      // reputation: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // //   validate: {
      // //     len: [1, 160],
      // //   },
      // },
      // demand: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // //   validate: {
      // //     len: [1, 160],
      // //   },
      // },
      // engagement: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // //   validate: {
      // //     len: [1, 160],
      // //   },
      // },
      // enablement: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // //   validate: {
      // //     len: [1, 160],
      // //   },
      // },
      // intelligence: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // //   validate: {
      // //     len: [1, 160],
      // //   },
      // },
    });

  OrderDetail.associate = function (models) {
    // We're saying that a OrderDetail should belong to an Order
    // A OrderDetail can't be created without an Order due to the foreign key constraint
    OrderDetail.belongsTo(models.Order, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return OrderDetail;
};