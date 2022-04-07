module.exports = function(sequelize, DataTypes) {
  const Customer = sequelize.define('Customer', {
    customer_id: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 160],
      },
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 160],
      },
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 160],
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 160],
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 160],
      },
    },
    zip: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 10],
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 20],
      },
    },
    // order_date: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },
  });

  Customer.associate = function(models) {
    // Associating Customer with Order
    // When an Order is deleted, also delete any associated Orders
      Customer.hasMany(models.Order, {
        onDelete: 'cascade',
    });
  };

  return Customer;
};