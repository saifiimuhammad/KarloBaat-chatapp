const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL,
  ],
  credentials: true,
};

const KARLOBAAT_TOKEN = "karlobaat-token";

const KARLOBAAT_ADMIN_TOKEN = "karlobaat-admin-token";

export { corsOptions, KARLOBAAT_TOKEN, KARLOBAAT_ADMIN_TOKEN };
