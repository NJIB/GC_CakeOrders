module.exports = function (sequelize, DataTypes) {
  const CakeOrder = sequelize.define('CakeOrder', {
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    cake_theme: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    cake_description: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    cake_special: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    cake_name: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    cake_age: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1, 160],
      // },
    },
    cake_girlboy: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    CustomerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      //   validate: {
      //     len: [1, 160],
      //   },
    },
    // RouteId: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
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

  CakeOrder.associate = function (models) {
    // We're saying that a OrderDetail should belong to an Order
    // A OrderDetail can't be created without an Order due to the foreign key constraint
    CakeOrder.belongsTo(models.Customer, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return CakeOrder;
};