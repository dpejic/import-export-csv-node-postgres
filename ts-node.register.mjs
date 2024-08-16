import url from "url";
import { register } from "module";

register("ts-node/esm", url.pathToFileURL("./"));
