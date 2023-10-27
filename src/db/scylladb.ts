
import cassandra from 'cassandra-driver'
import type { types } from 'cassandra-driver'
import { Video } from 'src/types';

export async function getScyllaDBCluster() {

  return new cassandra.Client({
    contactPoints: [process.env.SCYLLA_HOSTS!,],
    localDataCenter: process.env.SCYLLA_DATACENTER,
    credentials: { username: process.env.SCYLLA_USER!, password: process.env.SCYLLA_PASSWD! },
    keyspace: process.env.SCYLLA_KEYSPACE
  })
}

export function parseVideo(video: types.Row, progress = 0): Video {

  const parsedVideo: Video = {
    video_id: video.id,
    thumbnail: video.thumbnail,
    title: video.title,
    content_type: video.content_type,
    duration: video.duration,
    url: video.url,
    progress: progress
  };

  return parsedVideo;
}