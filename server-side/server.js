if (process.env.NODE_ENV === "development") {
    require('dotenv').config({ path: ".env.development" });
}
const app = require("./controller/app");

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
