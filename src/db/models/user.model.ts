import { sequelize } from ".";
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  ForeignKey,
} from "sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: number;
  declare firstName: string;
  declare password: string;
  declare email: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

// this configures the `userId` attribute.
// User.belongsTo(User);
// therefore, `userId` doesn't need to be specified here.
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    password: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    email: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "user",
    tableName: "users",
    underscored: true,
    timestamps: true,
    paranoid: true,
  }
);
