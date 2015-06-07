use Mix.Config

# Configure your database
config :hello_phoenix, HelloPhoenix.Repo,
  adapter: Ecto.Adapters.Postgres,
  url: {:system, "DATABASE_URL"}
