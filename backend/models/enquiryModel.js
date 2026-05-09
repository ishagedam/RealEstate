
import { DataTypes } from "sequelize";
import sequelize from "./db.js"; 

const Enquiry = sequelize.define("Enquiry", {
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  agent_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM("pending", "resolved"),
    defaultValue: "pending"
  }
}, {
  timestamps: true
});

export default Enquiry;