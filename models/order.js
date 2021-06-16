module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define('Order', {
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 160],
      },
    },
    order_date: {
      type: DataTypes.DATE,
      // allowNull: false,
      // validate: {
      //   len: [1, 160],
      // },
    },
    cake_theme: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 160],
      },
    },
    cake_description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_special: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_age: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_boygirl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_servings: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cake_layers: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cake_size1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_shape1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_flavor1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_filling1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_notes1: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_size2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_shape2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_flavor2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_filling2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_notes2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_size3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_shape3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_flavor3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_filling3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_notes3: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cake_price: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  });

  Order.associate = function(models) {
    // Associating Order with OrderDetails
    // When an Order is deleted, also delete any associated OrderDetails
    Order.hasMany(models.OrderDetail, {
      onDelete: 'cascade',
    });
  };

  return Order;
};