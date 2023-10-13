import { NextApiRequest, NextApiResponse } from "next";
import { getScyllaDBCluster } from "src/db/scylladb";
import { WatchHistory } from "src/types";

export default async function saveProgress(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (!req.body) {
        return res.status(422).json({ error: 'Failed to save progress into server.' });
    }

    const payload: WatchHistory = req.body;
    const cluster = await getScyllaDBCluster()
    const query = `UPDATE watch_history
                    SET progress=?, watched_at=?
                    WHERE user_id=? 
                    AND video_id=?`

    const params = [
        Math.floor(payload.progress),
        payload.watched_at,
        payload.user_id,
        payload.video_id
    ]

    await cluster.execute(query, params, { prepare: true })

    return res
        .status(201)
        .json({});
}
