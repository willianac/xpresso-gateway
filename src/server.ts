import Fastify from "fastify";
import xmlParser from "fastify-xml-body-parser";
import xmljs from "xml-js";

const fastify = Fastify({
	logger: false,
});

fastify.get("/", async function(req, rep) {
	rep.send("received");
});

fastify.register(xmlParser);

fastify.post("/xpresso", async function(req, rep) {
	const json = req.body as any;
	const xmlData = xmljs.js2xml(json, {compact: true});
	rep.type("text/xml");
	rep.send(xmlData);
});


fastify.listen({port: 3000}, function(err) {
	if(err) {
		console.log(err);
		process.exit(1);
	}
});
