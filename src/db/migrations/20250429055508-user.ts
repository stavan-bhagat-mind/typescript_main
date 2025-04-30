"use strict";
import { QueryInterface, DataTypes } from "sequelize";
import { ROLE, LOGIN_TYPE } from "../../utils/common/constants";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: typeof DataTypes) {
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_users_login_type" AS ENUM (${LOGIN_TYPE.map(
        (t) => `'${t}'`
      ).join(",")});
      CREATE TYPE "enum_users_user_type" AS ENUM (${ROLE.map(
        (r) => `'${r}'`
      ).join(",")});
    `);

    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
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
        allowNull: false,
      },
      user_type: {
        type: Sequelize.ENUM(...ROLE),
        defaultValue: ROLE[0],
      },
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      login_type: {
        type: Sequelize.ENUM(...LOGIN_TYPE),
        allowNull: false,
      },
      profile_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password_reset_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      password_reset_token_expiry: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      contact_number: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          isNumeric: true,
          len: [10, 15],
        },
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
  },
};
