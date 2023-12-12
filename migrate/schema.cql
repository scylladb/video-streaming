CREATE KEYSPACE IF NOT EXISTS streaming WITH replication = { 'class': 'NetworkTopologyStrategy', 'replication_factor': '3' };

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

-- Create a UDF for recent videos
CREATE OR REPLACE FUNCTION state_f(acc list<timestamp>, val timestamp)
CALLED ON NULL INPUT
RETURNS list<timestamp>
LANGUAGE lua
AS $$
    if val == nil then
        return acc
    end
    if acc == nil then
        acc = {}
    end

    table.insert(acc, val)
    table.sort(acc, function(a, b) return a > b end)
    if #acc > 10 then
        table.remove(acc, 11)
    end
    return acc
$$;


CREATE OR REPLACE FUNCTION reduce_f(acc1 list<timestamp>, acc2 list<timestamp>)
CALLED ON NULL INPUT
RETURNS list<timestamp>
LANGUAGE lua
AS $$
    result = {}
    i = 1
    j = 1
    
    while #result < 10 do
        if acc1[i] > acc2[j] then
            table.insert(result, acc1[i])
            i = i + 1
        else
            table.insert(result, acc2[j])
            j = j + 1
        end
    end
    return result
$$;


CREATE OR REPLACE AGGREGATE top10(timestamp)
SFUNC state_f
STYPE list<timestamp>
REDUCEFUNC reduce_f;

