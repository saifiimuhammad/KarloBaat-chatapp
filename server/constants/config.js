const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "http://172.22.96.1:5173",
    "http://192.168.0.103:5173",
    process.env.CLIENT_URL,
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const KARLOBAAT_TOKEN = "karlobaat-token";

const KARLOBAAT_ADMIN_TOKEN = "karlobaat-admin-token";

export { corsOptions, KARLOBAAT_TOKEN, KARLOBAAT_ADMIN_TOKEN };
