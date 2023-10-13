import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { getScyllaDBCluster, parseVideo } from "src/db/scylladb";
import { Video } from "src/types";

export  default async function getVideo(
    req: NextApiRequest,
    res: NextApiResponse<Video>
) {

    const cluster = await getScyllaDBCluster()
    const result = await cluster.execute(`SELECT * FROM streaming.video WHERE id = ?`, [req.query.videoId]);
    const fetchedVideo = result.rows[0];
    if (!fetchedVideo) {
        return res.status(404);
    }

    const video = parseVideo(fetchedVideo, 0)

    return res.status(200).json(video)
}