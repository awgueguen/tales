const { alias } = require("react-app-rewire-alias");

module.exports = function override(config) {
  alias({
    "@pages": "src/pages",
    "@components": "src/components",
    "@hooks": "src/hooks",
    "@styles": "src/styles",
  })(config);

  return config;
};
