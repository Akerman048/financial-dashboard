import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = "sandbox-financeapp-f6d922";
const CLIENT_SECRET = "c44c4c05-0bcd-40e1-a745-6c5efc9b3114";
const REDIRECT_URI = "http://localhost:3000/callback";

// health check
app.get("/", (_req, res) => {
  res.send("Backend is running");
});

// 1) code -> access token
app.get("/api/exchange", async (req, res) => {
  const code = req.query.code;

  console.log("CLIENT_ID:", CLIENT_ID);
  console.log("REDIRECT_URI:", REDIRECT_URI);
  console.log("HAS_SECRET:", Boolean(CLIENT_SECRET));
  console.log("CODE:", code);

  try {
    const response = await axios.post(
      "https://auth.truelayer-sandbox.com/connect/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 15000,
      },
    );

    console.log("TOKEN RESPONSE:", response.data);
    res.json(response.data);
  } catch (error) {
    console.log("TL ERROR:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: error.message });
  }
});

// 2) accounts
app.get("/api/accounts", async (req, res) => {
  const token = req.headers.authorization;

  try {
    const response = await axios.get(
      "https://api.truelayer-sandbox.com/data/v1/accounts",
      {
        headers: {
          Authorization: token,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.log("ACCOUNTS ERROR:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: error.message });
  }
});

// 3) cards
app.get("/api/cards", async (req, res) => {
  const token = req.headers.authorization;

  try {
    const response = await axios.get(
      "https://api.truelayer-sandbox.com/data/v1/cards",
      {
        headers: {
          Authorization: token,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.log("CARDS ERROR:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: error.message });
  }
});

// 4) account transactions
app.get("/api/accounts/:accountId/transactions", async (req, res) => {
  const token = req.headers.authorization;
  const { accountId } = req.params;

  try {
    const response = await axios.get(
      `https://api.truelayer-sandbox.com/data/v1/accounts/${accountId}/transactions`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.log("ACCOUNT TX ERROR:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: error.message });
  }
});

// 5) card transactions
app.get("/api/cards/:accountId/transactions", async (req, res) => {
  const token = req.headers.authorization;
  const { accountId } = req.params;

  try {
    const response = await axios.get(
      `https://api.truelayer-sandbox.com/data/v1/cards/${accountId}/transactions`,
      {
        headers: {
          Authorization: token,
        },
      },
    );

    res.json(response.data);
  } catch (error) {
    console.log("CARD TX ERROR:", error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: error.message });
  }
});

app.listen(3001, () => {
  console.log("🚀 Backend running on http://localhost:3001");
});
