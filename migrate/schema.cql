CREATE KEYSPACE IF NOT EXISTS streaming WITH replication = 
{ 'class': 'NetworkTopologyStrategy', 'replication_factor': '3' } and tablets = {'enabled': 'false'};

CREATE TABLE streaming.video (
    id text,
    content_type text,
    title text,
    url text,
    thumbnail text,
    created_at timestamp,
    duration int,
    PRIMARY KEY (id)
);

CREATE TABLE streaming.watch_history (
	user_id text,
	video_id text,
	progress int,
	watched_at timestamp,
	PRIMARY KEY (user_id, video_id)
);

CREATE MATERIALIZED VIEW streaming.recent_videos_view AS
    SELECT * FROM streaming.video
    WHERE created_at IS NOT NULL
    PRIMARY KEY (created_at, id);

USE streaming;
