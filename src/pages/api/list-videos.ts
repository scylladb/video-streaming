import { types } from "cassandra-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { getScyllaDBCluster, parseVideo } from "src/db/scylladb";
import { Video } from "src/types";

const userId = 'scylla-user';

export default async function listVideos(
    req: NextApiRequest,
    res: NextApiResponse<Video[]>
) {
    const cluster = await getScyllaDBCluster()
    const rawVideos = await cluster.execute("SELECT * FROM streaming.video LIMIT 9");


    const videoCollection = rawVideos.rows.map( async (rawVideo) => {
        let progressQuery = "SELECT progress FROM streaming.watch_history WHERE user_id = ? AND video_id = ?"
        const progress = await cluster.execute(progressQuery, [userId, rawVideo.id], { prepare: true });
        
        return parseVideo(rawVideo, getProgress(progress))
    });
    
    return res.status(200).json(await Promise.all(videoCollection));
}

function getProgress(progress: types.ResultSet) {
    return progress.first().get('progress') ?? 0;
}