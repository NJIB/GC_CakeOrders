module.exports = function(sequelize, DataTypes) {
  const Order = sequelize.define('Order', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 160],
      },
    },
    deal_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1],
      },
    },
    deal_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1],
      },
    },
    sgmt_rev: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1],
      },
    },
    deal_size_yoy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1],
      },
    },
    deal_count_yoy: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1],
      },
    },
    next_year_deal_size: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1],
      },
    },
    next_year_deal_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1],
      },
    },
    next_year_sgmt_rev: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: [1],
      },
    },

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