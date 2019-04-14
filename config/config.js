if (process.env.NODE_ENV === "production") {
  process.env.DB_URL = "mongodb://localhost:27017/uhub-production";
  process.env.PORT = "80";
} else if (process.env.NODE_ENV === "test") {
  process.env.DB_URL = "mongodb://localhost:27017/uhub-test";
  process.env.PORT = "3000";
} else if (process.env.NODE_ENV === "dev") {
  process.env.DB_URL = "mongodb://localhost:27017/uhub-dev";
  process.env.PORT = "8080";
}

process.env.JWT_KEY = "askdjaosdjoasdjaskdjaosdjoasdj";
