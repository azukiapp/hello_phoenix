/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Adds the systems that shape your system
systems({
  "hello-phoenix": {
    // Dependent systems
    depends: ['postgres'],
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/elixir"},
    // Steps to execute before running instances
    provision: [
      // "mix local.hex --force", // update mix
      "npm install",
      "mix do deps.get, compile",
      "mix ecto.create",
      "mix ecto.migrate",
    ],
    workdir: '/azk/#{manifest.dir}',
    shell: "/bin/bash",
    // Phoenix Framework
    command: "mix phoenix.server --no-deps-check",
    wait: {"retry": 20, "timeout": 1000},
    mounts: {
      "/azk/#{manifest.dir}"                : sync("."),
      // Elixir
      "/root/.hex"                          : path(env.HOME + '/.hex'),
      "/azk/#{manifest.dir}/deps"           : persistent("#{manifest.dir}/deps"),
      "/azk/#{manifest.dir}/_build"         : persistent("#{manifest.dir}/_build"),
      // Phoenix
      "/azk/#{manifest.dir}/node_modules"   : persistent("#{manifest.dir}/node_modules"),
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
      MIX_ENV: "dev"
    },
  },
  postgres: {
    // Dependent systems
    depends: [], // postgres, postgres, mongodb ...
    // More images:  http://images.azk.io
    image: {"docker": "azukiapp/postgres"},
    shell: "/bin/bash",
    wait: {"retry": 25, "timeout": 1000},
    mounts: {
      '/var/lib/postgresql': persistent("postgresql-#{system.name}"),
      '/var/log/postgresql': path("./log/postgresql"),
    },
    ports: {
      // exports global variables
      data: "5432/tcp",
    },
    envs: {
      // set instances variables
      POSTGRES_USER: "azk",
      POSTGRES_PASS: "azk",
      POSTGRES_DB  : "#{manifest.dir}_development",
    },
    export_envs: {
      // check this gist to configure your database
      // https://github.com/azukiapp/hello_phoenix/blob/master/config/config.exs#L22
      DATABASE_URL: "ecto+postgres://#{envs.POSTGRES_USER}:#{envs.POSTGRES_PASS}@#{net.host}:#{net.port.data}/${envs.POSTGRES_DB}?size=10",
    },
  },
  // TESTS Systems
  test: {
    extends: 'hello-phoenix',
    depends: ['postgres-test'],
    command: 'mix test; exit',
    wait: false,
    scalable: { limit: 0, default: 1 },
    envs: {
      MIX_ENV: "test"
    },
  },
  'postgres-test': {
    extends: 'postgres',
    envs: {
      POSTGRES_USER: "azk",
      POSTGRES_PASS: "azk",
      POSTGRES_DB: "#{manifest.dir}_test",
    },
    scalable: { limit: 0, default: 1 },
    export_envs: {
      // check this gist to configure your database
      // https://github.com/azukiapp/hello_phoenix/blob/master/config/config.exs#L22
      DATABASE_URL: "ecto+postgres://#{envs.POSTGRES_USER}:#{envs.POSTGRES_PASS}@#{net.host}:#{net.port.data}/${envs.POSTGRES_DB}?size=10",
    },
  }
});
