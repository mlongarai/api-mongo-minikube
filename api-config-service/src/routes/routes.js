const express = require("express");

const ConfigController = require("../controllers/ConfigController");

const routes = express.Router();

routes.get("/configs", ConfigController.listAllConfigs);
routes.post("/configs", ConfigController.createConfig);
routes.get("/configs/:name", ConfigController.getConfigByName);
routes.put("/configs/:name", ConfigController.updateConfig);
routes.delete("/configs/:name", ConfigController.deleteConfig);
routes.get("/search", ConfigController.searchConfigs);

module.exports = routes;
