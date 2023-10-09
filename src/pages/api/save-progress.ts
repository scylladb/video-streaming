import { getScyllaDBCluster } from "src/db/scylladb";

export async function saveProgress(request: Request) {
    if (request.body) {
        const values: any = request.body
        const cluster = await getScyllaDBCluster()
        const query = `UPDATE watch_history
                        SET progress=?, watched_at=?
                        WHERE user_id=? 
                        AND video_id=?`
        const params = [Math.floor(values.progress), values.watched_at, values.user_id, values.video_id]
        cluster.execute(query, params, {prepare: true})
    }
}

export default saveProgress
