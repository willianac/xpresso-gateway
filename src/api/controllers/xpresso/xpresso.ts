import { FastifyInstance } from "fastify";
import { js2xml } from "xml-js";

const routes = async (server: FastifyInstance) => {
	server.get("/", async function(req, rep) {
		rep.send("received");
	});
	
	server.post("/xpresso/xp/9714", async function(req, rep) {
		const body = req.body as object;
		const jsObject = {...body};
		const xmlData = js2xml(jsObject, {compact: true});

		rep.type("text/xml");
		rep.send(xmlData);
	});
};

export default routes;