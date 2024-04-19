import Fastify from "fastify";
import xmlParser from "fastify-xml-body-parser";
import formParser from "@fastify/formbody";
import routes from "./controllers/xpresso/xpresso.js";

const fastify = Fastify({
	logger: false,
});
fastify.register(xmlParser);
fastify.register(formParser);
fastify.register(routes);

fastify.listen({port: 3000}, function(err) {
	if(err) {
		console.log(err);
		process.exit(1);
	}
});
