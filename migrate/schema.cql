CREATE KEYSPACE IF NOT EXISTS streaming WITH replication = { 'class': 'NetworkTopologyStrategy', 'replication_factor': '3' };

CREATE TABLE streaming.video (
    id text,
    content_type text,
    title text,
    url text,
    thumbnail text,
    created_at timestamp,
    PRIMARY KEY (id, created_at)
);

CREATE TABLE streaming.watch_history (
	user_id text,
	video_id text,
	progress int,
	watched_at timestamp,
	PRIMARY KEY (user_id, video_id)
);
