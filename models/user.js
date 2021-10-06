module.exports = (Sequelize, DataTypes) => {
  const Users = Sequelize.define("users", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
  });

  Users.associate = (models) => {
    models.users.belongsTo(models.roles, {
      foreignKey: "role_id",
      targetKey: "role_id",
    });
  };

  return Users;
};
