document.getElementById("likeForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const urlInput = document.getElementById("url");
    const submitBtn = document.getElementById("submitBtn");
    const btnText = document.querySelector(".btn-text");
    const loader = document.getElementById("loader");
    const resultArea = document.getElementById("resultArea");
    const output = document.getElementById("output");

    const videoUrl = urlInput.value.trim();

    if (!videoUrl) {
        alert("Masukkan URL TikTok terlebih dahulu");
        return;
    }

    // Loading UI
    submitBtn.disabled = true;
    btnText.style.display = "none";
    loader.style.display = "block";
    resultArea.classList.add("hidden");

    try {

        const response = await fetch("/api/tiktok", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: videoUrl
            })
        });

        let data;

        try {
            data = await response.json();
        } catch {
            throw new Error("Response bukan JSON");
        }

        // tampilkan area hasil
        resultArea.classList.remove("hidden");

        if (response.ok && data.success) {

            output.textContent = JSON.stringify(data.data, null, 2);
            output.style.color = "green";

        } else {

            output.textContent =
                data.message ||
                data.error ||
                "Terjadi kesalahan pada server.";

            output.style.color = "red";

        }

    } catch (error) {

        resultArea.classList.remove("hidden");

        output.textContent =
            "Tidak bisa terhubung ke server.\n" + error.message;

        output.style.color = "red";

    } finally {

        submitBtn.disabled = false;
        btnText.style.display = "block";
        loader.style.display = "none";

    }
});
