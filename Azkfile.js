/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  "hello-phoneix": {
    // Dependent systems
    depends: [],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/elixir"},
    // Steps to execute before running instances
    provision: [
      "mix do deps.get, mix compile"
    ],
    workdir: '/azk/#{manifest.dir}',
    shell: "/bin/bash",
    command: "mix run --no-halt",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      "/azk/#{manifest.dir}"       : sync("."),
      "/azk/#{manifest.dir}/_build": persistent("#{system.name}/_build"),
      "/azk/#{manifest.dir}/.hex"  : persistent("#{system.name}/.hex"),
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
