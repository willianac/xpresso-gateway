import { FastifyInstance } from "fastify";
import xmljs from "xml-js";

const routes = async (server: FastifyInstance) => {
	server.get("/", async function(req, rep) {
		rep.send("received");
	});
	
	server.post("/xpresso", async function(req, rep) {
		const json = req.body as object;
		const xmlData = xmljs.js2xml(json, {compact: true});
		rep.type("text/xml");
		rep.send(xmlData);
	});
};

export default routes;