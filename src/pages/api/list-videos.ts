import { types } from "cassandra-driver";
import { NextApiRequest, NextApiResponse } from "next";
import { getScyllaDBCluster, parseVideo } from "src/db/scylladb";
import { Video } from "src/types";

const userId = 'scylla-user';

export default async function listVideos(
    req: NextApiRequest,
    res: NextApiResponse<Video[]>
) {
    const cluster = await getScyllaDBCluster();
    const queryVideoDates = "SELECT id, top10(created_at) AS date FROM recent_videos_view;"
    const query = `SELECT * FROM recent_videos_view
                    WHERE created_at IN ?
                    LIMIT 10`;
    const videoDates = await cluster.execute(queryVideoDates);                
    const rawVideos = await cluster.execute(query, [videoDates.rows[0]?.date], { prepare: true });


    const videoCollection = rawVideos.rows.map(async (rawVideo) => {
        let progressQuery = "SELECT progress FROM streaming.watch_history WHERE user_id = ? AND video_id = ?"
        const progress = await cluster.execute(progressQuery, [userId, rawVideo.id], { prepare: true });

        return parseVideo(rawVideo, getProgress(progress))
    });

    return res.status(200).json(await Promise.all(videoCollection));
}

function getProgress(progress: types.ResultSet): number {
    let firstRow = progress.first();

    if (!firstRow) {
        return 0;
    }

    return progress.first().get('progress') ?? 0;
}