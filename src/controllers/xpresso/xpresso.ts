import { FastifyInstance } from "fastify";

const routes = async (server: FastifyInstance) => {
	server.get("/", async function(req, rep) {
		rep.send("received");
	});
	
	server.post("/xpresso", async function(req, rep) {
		const obj = req.body;
		console.log(obj);
		rep.send(obj);
	});
};

export default routes;