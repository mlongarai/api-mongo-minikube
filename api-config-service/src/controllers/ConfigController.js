const statusCode = require("http-status-codes");
const model = require("../models/Config");

class ConfigController {
  async listAllConfigs(_req, res) {
    try {
      const data = await model.find({});
      res.status(statusCode.OK).json(data);
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  }
  async createConfig(req, res) {
    try {
      const data = await model.create(req.body);
      res.status(statusCode.CREATED).json(data);
    } catch (err) {
      res.status(statuscode.INTERNAL_SERVER_ERROR).json(err);
    }
  }
  async getConfigByName(req, res) {
    try {
      const { name } = req.params;
      const data = await model.find({ name });
      res.status(statusCode.OK).json(data);
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).send(err);
    }
  }
  async updateConfig(req, res) {
    try {
      const data = await model.findOneAndUpdate(req.params.name, req.body, {
        new: true
      });
      res.status(statusCode.OK).json(data);
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  }
  async deleteConfig(req, res) {
    try {
      const data = await model.findOneAndDelete(req.params.name);
      res.status(statusCode.OK).send("Config Deleted successfully");
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  }
  async searchConfigs(req, res) {
    try {
      const data = await model.find(req.query);
      res.status(statusCode.OK).json(data);
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(err);
    }
  }
}
module.exports = new ConfigController();
