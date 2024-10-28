import express from "express";
import ejs from "ejs";
import path from "path";

const PORT = 5630;
const app = express();

app.set("views", __dirname);
app.engine("html", ejs.renderFile);
app.use(express.static(path.join(__dirname , 'public')));

app.get("/", (_req, res) => {
    res.render("public/index.html");
});

app.get("/sort/:sortType", (_req, res) => {
    res.render("public/sort/visualization.html");
});

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});