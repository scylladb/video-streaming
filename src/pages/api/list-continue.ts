import { NextApiRequest, NextApiResponse } from "next"
import { getScyllaDBCluster } from "src/db/scylladb"
import { Video } from "src/types"

const userId = 'scylla-user'

export default async function listContinue(
    req: NextApiRequest,
    res: NextApiResponse<Video[]>
) {
    const cluster = await getScyllaDBCluster()

    // fetch video IDs
    const watchedVideos = await cluster.execute("SELECT video_id, progress FROM watch_history WHERE user_id = ? LIMIT 9;", [userId])

    if (watchedVideos.rows.length === 0) {
        return res.status(200).json([]);
    }


    let watchedVideoProgress = new Map()

    for (const row of watchedVideos.rows) {
        watchedVideoProgress.set(row.video_id, row.progress)
    }

    // fetch video content
    let videos: Video[] = [];

    const query = 'SELECT * FROM video WHERE id in ?'
    const videoIDs = Array.from(watchedVideoProgress.keys())
    const results = await cluster.execute(query, [videoIDs], { prepare: true })

    for (const row of results.rows) {

        const video: Video = {
            video_id: row.id,
            thumbnail: row.thumbnail,
            title: row.title,
            content_type: row.content_type,
            url: row.url,
            progress: watchedVideoProgress.get(row.id)
        };

        videos.push(video)
    }

    return res.status(200).json(videos);
}