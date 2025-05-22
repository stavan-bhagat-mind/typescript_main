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
  declare github_id?: string;
  declare auth_method: string;
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

export default (sequelize: Sequelize, dataTypes: typeof DataTypes) => {
  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
      },
      first_name: {
        allowNull: false,
        type: dataTypes.STRING,
      },
      last_name: {
        allowNull: false,
        type: dataTypes.STRING,
      },
      password: {
        allowNull: true,
        defaultValue: null,
        type: dataTypes.TEXT,
      },
      email: {
        allowNull: false,
        type: dataTypes.STRING,
      },
      user_type: {
        type: dataTypes.ENUM(...ROLE),
        defaultValue: ROLE[0],
      },
      google_id: {
        type: dataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      github_id: {
        type: dataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      auth_method: {
        type: dataTypes.ENUM(...Object.values(LOGIN_TYPE)),
        allowNull: false,
      },
      profile_url: {
        type: dataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      password_reset_token: {
        type: dataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      password_reset_token_expiry: {
        type: dataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      contact_number: {
        type: dataTypes.STRING,
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
        defaultValue: null,
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
