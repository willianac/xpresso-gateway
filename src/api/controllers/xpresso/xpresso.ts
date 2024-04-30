import { FastifyInstance } from "fastify";
import { handleTransaction } from "../../handlers/handleTransaction.js";
import { XpressoPayload } from "../../../types/XpressoPayload.js";
import { js2xml } from "xml-js";

const routes = async (server: FastifyInstance) => {
	server.get("/", async function(req, rep) {
		rep.send("received");
	});
	
	server.post("/xpresso/xp/9714", async function(req, rep) {
		const body = req.body as object;
		const transactionObj = {...body as XpressoPayload};
		const result = await handleTransaction(transactionObj);
		const xml = js2xml(result, {compact: true});
		rep.type("text/xml");
		rep.send(xml);
	});
};

export default routes;