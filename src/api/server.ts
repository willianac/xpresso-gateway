import "dotenv/config";
import Fastify from "fastify";
import xmlParser from "fastify-xml-body-parser";
import formParser from "@fastify/formbody";
import routes from "../controllers/xpresso/xpresso.js";

const fastify = Fastify({
	logger: false,
});
fastify.register(xmlParser);
fastify.register(formParser);
fastify.register(routes);

const PORT = process.env.PORT || 3000;
const HOST = process.env.NODE_ENV === "prod" ? "0.0.0.0" : "127.0.0.1";

fastify.listen({port: Number(PORT), host: HOST}, function(err) {
	if(err) {
		console.log(err);
		process.exit(1);
	}
});
