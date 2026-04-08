// api/tiktok.js

import axios from "axios";

export default async function handler(req, res) {

  // hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method tidak diizinkan"
    });
  }

  const { url } = req.body;

  // validasi input
  if (!url) {
    return res.status(400).json({
      success: false,
      message: "URL TikTok wajib diisi"
    });
  }

  try {

    // ===============================
    // 1. ambil halaman leofame
    // ===============================
    const page = await axios.get(
      "https://leofame.com/free-tiktok-likes",
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
        },
        timeout: 15000
      }
    );

    const html = page.data;

    // ===============================
    // 2. ambil token dari html
    // ===============================
    const tokenMatch =
      html.match(/token\s*=\s*['"]([^'"]+)['"]/) ||
      html.match(/var\s+token\s*=\s*['"]([^'"]+)['"]/);

    if (!tokenMatch) {
      return res.status(500).json({
        success: false,
        message: "Token tidak ditemukan di halaman leofame"
      });
    }

    const token = tokenMatch[1];

    // ===============================
    // 3. ambil cookies
    // ===============================
    const cookies = page.headers["set-cookie"]
      ? page.headers["set-cookie"]
          .map((v) => v.split(";")[0])
          .join("; ")
      : "";

    // ===============================
    // 4. kirim request like
    // ===============================
    const response = await axios.post(
      "https://leofame.com/free-tiktok-likes?api=1",
      new URLSearchParams({
        token: token,
        free_link: url,
        timezone_offset: "-480"
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Origin: "https://leofame.com",
          Referer: "https://leofame.com/free-tiktok-likes",
          Cookie: cookies,
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
        },
        timeout: 15000
      }
    );

    // ===============================
    // 5. kirim response ke frontend
    // ===============================
    return res.status(200).json({
      success: true,
      data: response.data
    });

  } catch (error) {

    console.error("SERVER ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
      error: error.message,
      detail: error.response?.data || null
    });

  }
}
