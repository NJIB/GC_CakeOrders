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
    cake_occasion: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_servings: {
      type: DataTypes.INTEGER,
      allowNull: false,
      //   validate: {
      //     len: [1, 160],
      //   },
    },
    cake_size1: {
      type: DataTypes.INTEGER,
      allowNull: false,
      //   validate: {
      //     len: [1, 160],
      //   },
    },
    cake_shape1: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_flavor1: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_filling1: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_notes1: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_size2: {
      type: DataTypes.INTEGER,
      allowNull: false,
      //   validate: {
      //     len: [1, 160],
      //   },
    },
    cake_shape2: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_flavor2: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_filling2: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_notes2: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_size3: {
      type: DataTypes.INTEGER,
      allowNull: false,
      //   validate: {
      //     len: [1, 160],
      //   },
    },
    cake_shape3: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_flavor3: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_filling3: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_notes3: {
      type: DataTypes.STRING,
      allowNull: true,
      // validate: {
      //   len: [1],
      // },
    },
    cake_price: {
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