import { Elysia } from "elysia";
import { renderLitComponent } from "./handlers";

const port = process.env.PORT || 3000;

new Elysia()
  .post("/", renderLitComponent)
  .get("/test", () => ({ status: 200, body: "test" }))
  .listen(port, () => {
    console.log(
      `Warning: this project execute all dependencies locally (that you provided in \`/\`), be cafeful.`
    );
    console.log(`listening on port ${port}.`);
  });
