// debug-index-router.js
const express = require("express");
const Router = express.Router();
const IndexRouter = require("./Route/index.router");

console.log("=== DEBUGGING index.router.js ===");
console.log("Stack length:", IndexRouter.stack.length);

IndexRouter.stack.forEach((layer, index) => {
  console.log(`\nLayer ${index}:`);
  console.log("  name:", layer.name);
  console.log("  regexp:", layer.regexp);
  console.log("  path:", layer.path);

  if (layer.route) {
    console.log("  route path:", layer.route.path);
    console.log("  route methods:", Object.keys(layer.route.methods));
  }

  if (layer.name === "router" && layer.handle) {
    console.log("  nested router found!");
    console.log("  nested stack length:", layer.handle.stack.length);
  }
});
