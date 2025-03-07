import request from "./lib/request";
import Printer from "./lib/printer";
import versions from "./lib/versions";
import attributes from "./lib/attributes";
import keywords from "./lib/keywords";
import enums from "./lib/enums";
import tags from "./lib/tags";
import statusCodes from "./lib/status-codes";
import { Buffer } from "buffer";
import {
  generateZPL,
  generateLabelArray,
  convertTextArrayToZPL,
} from "./lib/zpl";
import { getPrinters } from "./lib/printer-list";

export default {
  request,
  Printer,
  versions,
  attributes,
  keywords,
  enums,
  tags,
  statusCodes,
  Buffer,
  generateZPL,
  getPrinters,
  generateLabelArray,
  convertTextArrayToZPL,
};
