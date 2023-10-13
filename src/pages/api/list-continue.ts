import { NextApiRequest, NextApiResponse } from "next"
import { getScyllaDBCluster, parseVideo } from "src/db/scylladb"
import { Video } from "src/types"

const userId = 'scylla-user'

export default async function listContinue(
    req: NextApiRequest,
    res: NextApiResponse<Video[]>
) {
    const cluster = await getScyllaDBCluster()

    // fetch video IDs
    const watchedVideosProgresses = await cluster.execute("SELECT video_id, progress FROM watch_history WHERE user_id = ? LIMIT 9;", [userId])

    if (watchedVideosProgresses.rows.length === 0) {
        return res.status(200).json([]);
    }


    const watchedVideoProgress = new Map<string, number>()

    for (const row of watchedVideosProgresses.rows) {
        watchedVideoProgress.set(row.video_id, row.progress)
    }

    const query = 'SELECT * FROM video WHERE id in ?'
    const videoIDs = Array.from(watchedVideoProgress.keys())
    const results = await cluster.execute(query, [videoIDs], { prepare: true })
    const watchedVideos = results.rows.map((video) => parseVideo(video, watchedVideoProgress.get(video.id)))

    return res.status(200).json(watchedVideos);
}