module.exports = function(sequelize, DataTypes) {
  const Customer = sequelize.define('Customer', {
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
    order_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  Customer.associate = function(models) {
    // Associating Order with OrderDetails
    // When an Order is deleted, also delete any associated OrderDetails
    // Order.hasMany(models.OrderDetail, {
      Customer.hasMany(models.Order, {
        onDelete: 'cascade',
    });
  };

  return Customer;
};