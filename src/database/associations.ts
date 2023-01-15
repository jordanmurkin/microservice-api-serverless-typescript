import User from '@database/models/User';

// Customer is created by User

// User.hasMany(Customer, {
//   as: 'user',
//   foreignKey: {
//     name: 'createdBy',
//     allowNull: false,
//   },
// });

// Customer.belongsTo(User, {
//   as: 'user',
//   foreignKey: {
//     name: 'createdBy',
//     allowNull: false,
//   },
// });
