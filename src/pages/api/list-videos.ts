import { NextApiRequest, NextApiResponse } from "next";
import { getScyllaDBCluster } from "src/db/scylladb";
import { Video } from "src/types";

const userId = 'scylla-user';

export default async function listVideos(
    req: NextApiRequest,
    res: NextApiResponse<Video[]>
) {
    const videoCollection: Video[] = [];
    const cluster = await getScyllaDBCluster()
    const rawVideos = await cluster.execute("SELECT * FROM streaming.video LIMIT 9");

    for (let rawVideo of rawVideos) {
        let progressQuery = "SELECT progress FROM streaming.watch_history WHERE user_id = ? AND video_id = ?"
        const progress = await cluster.execute(progressQuery, [userId, rawVideo.id], { prepare: true });

        const video: Video = {
            video_id: rawVideo.id,
            progress: getProgress(progress),
            ...rawVideo
        };

        videoCollection.push(video);
    }
    
    return res.status(200).json(videoCollection);
}

function getProgress(progress) {
    return progress.rows.length > 0 ? progress.rows[0].progress : 0;
}