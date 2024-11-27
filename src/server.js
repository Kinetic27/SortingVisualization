import express from "express";
import ejs from "ejs";
import path from "path";


// define port
const PORT = 5630;
const app = express();

// set engine
app.set("views", __dirname);
app.engine("html", ejs.renderFile);
app.use(express.static(path.join(__dirname , 'public')));

// main page router
app.get("/", (_req, res) => {
    res.render("public/index.html");
});

// sort page router
app.get("/sort/:sortType", (_req, res) => {
    res.render("public/sort/visualization.html");
});

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
});