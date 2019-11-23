const mongoose = require("mongoose");
const mongooseHidden = require("mongoose-hidden")();

const Config = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    metadata: {
      monitoring: {
        enabled: {
          type: Boolean,
          required: true
        }
      },
      limits: {
        cpu: {
          enabled: {
            type: Boolean,
            required: true
          },
          value: {
            type: String,
            required: true
          }
        }
      }
    }
  },
  {
    versionKey: false
  },
  {
    timestamps: true
  }
);

Config.plugin(mongooseHidden);
module.exports = mongoose.model("Config", Config);
