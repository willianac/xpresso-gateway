import { FastifyInstance } from "fastify";
import { handleTransaction } from "../../handlers/handleTransaction.js";
import { XpressoPayload } from "../../../types/XpressoPayload.js";

const routes = async (server: FastifyInstance) => {
	server.get("/", async function(req, rep) {
		rep.send("received");
	});
	
	server.post("/xpresso/xp/9714", async function(req, rep) {
		const body = req.body as object;
		const transactionObj = {...body as XpressoPayload};
		handleTransaction(transactionObj);
		rep.status(200).send();
	});
};

export default routes;