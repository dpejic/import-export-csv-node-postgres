import * as pgCopyStream from "pg-copy-streams";
import fs from "fs";
import client, { connectClient } from "./pg-client/pg-client";

await connectClient();

await client.query(`
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50),
    first_name VARCHAR(50),
    last_name VARCHAR(50)
  );
`);

const inputCsvFilePath = new URL("./static/sample.csv", import.meta.url);
const readInputCsvStream = fs.createReadStream(inputCsvFilePath);

const copyFromCsvStream = await client.query(
  pgCopyStream.from(
    "COPY users(username, first_name, last_name) FROM STDIN DELIMITER ';' CSV HEADER"
  )
);

copyFromCsvStream.on("finish", async () => {
  console.log("Finished importing CSV data into db.");
  console.log("Now export data into output CSV file:");

  const outputCsvFilePath = new URL("./static/output.csv", import.meta.url);
  const writeOutputCsvStream = fs.createWriteStream(outputCsvFilePath);

  const copyToCsvStream = await client.query(
    pgCopyStream.to(
      "COPY users TO STDOUT WITH (FORMAT csv, HEADER, DELIMITER ';', QUOTE '\"')"
    )
  );

  copyToCsvStream.pipe(writeOutputCsvStream);

  writeOutputCsvStream.on("finish", () => {
    console.log("Oh you are fast... :)");

    client.end();
    process.exit(1);
  });
});

copyFromCsvStream.on("error", (err: any) => {
  console.log("Stream error", err);
});

readInputCsvStream.pipe(copyFromCsvStream);
