import { getBackendSDK } from "../../../utils/getBackendSDK";

export default async function handler(req, res) {
  try {
    const {
      body,
    } = req.body;
    
    const sdk = await getBackendSDK();

    const response = await sdk.api.p2ps.create(
      body,
    );

    res.status(200).json({ data: response, status: "ok" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error" });
  }
}
