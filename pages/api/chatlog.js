import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    const session = await getSession({ req });
    if (!session) {
        return res.status(401);
    } else {
        return res.status(200).json({poop: "1"});
    }
}