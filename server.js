const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
// /reset için opsiyonel koruma. ADMIN_KEY tanımlıysa ?key=... zorunlu olur.
const ADMIN_KEY = process.env.ADMIN_KEY || "";

app.use(express.static(__dirname + "/public"));

// Kök adres büyük ekran tablosuna gitsin
app.get("/", (req, res) => res.redirect("/mainPage.html"));

let scores = [];

app.get("/reset", (req, res) => {
    if (ADMIN_KEY && req.query.key !== ADMIN_KEY) {
        return res.status(403).send("forbidden");
    }
    console.log("RESET WORKS");

    scores = [];
    io.emit("currentTop5", []);

    res.send("reset ok");
});

function getTop5() {
    return [...scores]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
}

io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("newScore", (data) => {
        // Basit doğrulama: geçersiz veriyi yok say
        if (!data || typeof data.score !== "number" || Number.isNaN(data.score)) {
            return;
        }
        scores.push({
            name: String(data.name || "").slice(0, 50),
            surname: String(data.surname || "").slice(0, 50),
            score: data.score
        });
        io.emit("currentTop5", getTop5());
    });

    // iPad butonundan gelir, büyük ekranın sesi çalması için herkese yayınla
    socket.on("playSound", () => {
        io.emit("playSound");
    });

    socket.on("getTop5", () => {
        socket.emit("currentTop5", getTop5());
    });

    socket.emit("currentTop5", getTop5());
});

server.listen(PORT, () => {
    console.log("Listening on port " + PORT);
});
