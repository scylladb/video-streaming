export interface Video {
    video_id: string,
    thumbnail: string,
    title: string,
    content_type: string,
    url: string,
    duration: number,
    progress: number
}

export interface WatchHistory {
    user_id: string,
    video_id: string,
    progress: number,
    watched_at: Date
}
