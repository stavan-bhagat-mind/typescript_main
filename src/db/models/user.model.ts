// user.model.ts - Corrected with proper export
import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Sequelize,
} from "sequelize";
import { ROLE } from "../../utils/common/constants";
import { LOGIN_TYPE } from "../../utils/common/constants";
class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: number;
  declare first_name: string;
  declare last_name: string;
  declare password: string;
  declare email: string;
  declare user_type: string;
  declare google_id?: string;
  declare login_type: string;
  declare profile_url?: string;
  declare password_reset_token?: string;
  declare password_reset_token_expiry?: Date;
  declare contact_number?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date;

  // Add static associate method if you need associations
  static associate(models: any) {
    // Define associations here
    // For example: User.hasMany(models.Post)
  }
}

// Export a function that initializes the model
export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  User.init(
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: {
        allowNull: false,
        type: dataTypes.TEXT,
      },
      last_name: {
        allowNull: false,
        type: dataTypes.TEXT,
      },
      password: {
        allowNull: false,
        type: dataTypes.TEXT,
      },
      email: {
        allowNull: false,
        type: dataTypes.TEXT,
      },
      user_type: {
        type: dataTypes.ENUM(...ROLE),
        defaultValue: ROLE[0],
      },
      google_id: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      login_type: {
        type: dataTypes.ENUM(...LOGIN_TYPE),
        allowNull: false,
      },
      profile_url: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      password_reset_token: {
        type: dataTypes.STRING,
        allowNull: true,
      },
      password_reset_token_expiry: {
        type: dataTypes.DATE,
        allowNull: true,
      },
      contact_number: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
      },
      createdAt: dataTypes.DATE,
      updatedAt: dataTypes.DATE,
      deletedAt: {
        type: dataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      underscored: true,
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );

  return User;
};
