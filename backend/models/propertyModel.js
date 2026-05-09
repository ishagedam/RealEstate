


import { DataTypes } from "sequelize";
import sequelize from "./db.js";



const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    agent_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.TEXT,
    },

    features: {
      type: DataTypes.TEXT,
    },

    amenities: {
      type: DataTypes.TEXT,
    },

    floor: {
      type: DataTypes.STRING,
    },

    is_available: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    },

    property_status: {
      type: DataTypes.STRING,
    },

    status: {
      type: DataTypes.ENUM("pending", "approved"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "properties",
    timestamps: true,
  }
);

export default Property;

