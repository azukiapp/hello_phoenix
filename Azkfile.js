/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  "hello-phoenix": {
    // Dependent systems
    depends: [],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/elixir"},
    // Steps to execute before running instances
    provision: [
      // "mix local.hex --force", // update mix
      "npm install",
      "mix do deps.get, compile",
    ],
    workdir: '/azk/#{manifest.dir}',
    shell: "/bin/bash",
    // Phoenix Framework
    command: "mix phoenix.server --no-deps-check",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      "/azk/#{manifest.dir}"             : sync("."),
      // Dependêncies
      "/azk/#{manifest.dir}/deps"           : persistent("#{manifest.dir}/deps"),
      "/azk/#{manifest.dir}/.hex"           : persistent("#{manifest.dir}/.hex"),
      "/azk/#{manifest.dir}/node_modules"   : persistent("#{manifest.dir}/node_modules"),
      // Builds
      "/azk/#{manifest.dir}/_build"         : persistent("#{manifest.dir}/_build"),
      "/azk/#{manifest.dir}/priv/static/js" : persistent("#{manifest.dir}/priv/static/js"),
      "/azk/#{manifest.dir}/priv/static/css": persistent("#{manifest.dir}/priv/static/css"),
    },
    scalable: {"default": 1},
    http: {
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    ports: {
      http: "4000",
    },
    envs: {
      // set instances variables
      HEX_HOME: "/azk/#{manifest.dir}/.hex"
    },
  },
});
