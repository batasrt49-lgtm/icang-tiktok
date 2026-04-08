// api/tiktok.js
import axios from "axios";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL TikTok wajib diisi!" });
  }

  try {

    // 1. ambil halaman leofame
    const page = await axios.get(
      "https://leofame.com/free-tiktok-likes",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
        timeout: 10000,
      }
    );

    const html = page.data;

    // 2. ambil token
    const tokenMatch =
      html.match(/token\s*=\s*['"]([^'"]+)['"]/) ||
      html.match(/var\s+token\s*=\s*['"]([^'"]+)['"]/);

    if (!tokenMatch) {
      return res.status(500).json({
        error: "Token tidak ditemukan",
      });
    }

    const token = tokenMatch[1];

    // 3. ambil cookie
    const cookies = page.headers["set-cookie"]
      ? page.headers["set-cookie"].map((v) => v.split(";")[0]).join("; ")
      : "";

    // 4. kirim request like
    const response = await axios.post(
      "https://leofame.com/free-tiktok-likes?api=1",
      new URLSearchParams({
        token: token,
        free_link: url,
        timezone_offset: "-480",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "https://leofame.com",
          Referer: "https://leofame.com/free-tiktok-likes",
          Cookie: cookies,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        },
        timeout: 10000,
      }
    );

    return res.status(200).json(response.data);

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      error: "Server error",
      message: error.message,
    });

  }
}
