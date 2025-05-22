"use strict";
import { QueryInterface, DataTypes } from "sequelize";
import { ROLE, LOGIN_TYPE } from "../../utils/common/constants";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        unique: true,
        defaultValue: Sequelize.UUIDV4,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      user_type: {
        type: Sequelize.ENUM(...ROLE),
        defaultValue: ROLE[0],
      },
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      github_id: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      auth_method: {
        type: Sequelize.ENUM(...Object.values(LOGIN_TYPE)),
        allowNull: false,
      },
      profile_url: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      password_reset_token: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      password_reset_token_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      contact_number: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
        defaultValue: null,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface: QueryInterface, Sequelize: any) {
    await queryInterface.dropTable("users");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_auth_method";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_users_user_type";'
    );
  },
};
