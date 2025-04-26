import { create } from "ipfs-http-client";


export const ipfsClient = create({
  host: "127.0.0.1",
  port: 5001,
  protocol: "http",

});