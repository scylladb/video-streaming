import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import { useEffect, useRef } from "react";
import SideBar from "src/components/menu/SideBar";
import TopBar from "src/components/menu/TopBar";
import { Video } from 'src/types';
import videojs from "video.js";
import "video.js/dist/video-js.css";
import 'videojs-youtube';

const userId = "scylla-user"

export async function getServerSideProps(context) {
    const progress = context.query.progress ?? 0
    const videoId = context.params.videoId

    let response = await fetch(process.env.APP_BASE_URL + `/api/videos/${videoId}`);
    let video: Video = await response.json();
    video.progress = progress

    return { props: video }
}

const defaultTheme = createTheme();

export default function Watch(video: Video) {
    const videoRef = useRef(null);
    useEffect(() => {
        let player: any
        if (videoRef.current) {
            player = videojs(videoRef.current, {
                sources: [
                    {
                        src: `${video.url}`,
                        type: `${video.content_type}`
                    }
                ],
            })
        }
        if (player) {
            /**
            * SAVE PROGRESS TO WATCH HISTORY
            */
            player.on("pause", () => {

                const videoId = video.video_id
                const progress = player.currentTime()
                const watchedAt = new Date().toISOString();
                const payload = { user_id: userId, video_id: videoId, progress: progress, watched_at: watchedAt }

                // insert into db
                fetch('/api/save-progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })
            })
            /**
            * SET VIDEO START TIME
            */
            player.on("loadstart", () => {
                player.currentTime(video.progress)
            })
        }
    })
    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <TopBar title="Watch video" />
                <SideBar />
                {/* Page content */}
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h4" component="h1">{video.title}</Typography>
                            <video controls ref={videoRef} className="video-js" height={'500'} />
                        </Box>
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
