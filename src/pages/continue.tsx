import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import VideoCard from 'src/components/VideoCard';
import { getScyllaDBCluster } from "src/db/scylladb";
import Footer from "src/components/Footer"
import TopBar from "src/components/menu/TopBar"
import SideBar from "src/components/menu/SideBar"


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export async function getServerSideProps() {
  const cluster = await getScyllaDBCluster()
  // fetch video IDs
  const userId = 'asd'
  const watchedVideos = await cluster.execute("SELECT video_id, progress FROM watch_history WHERE user_id = ? LIMIT 9;", [userId])
  let watchedVideoProgress = new Map()
  for (const row of watchedVideos.rows) {
    watchedVideoProgress.set(row.video_id, row.progress)
  }
  // fetch video content
  let data: Object[] = [];
  const query = 'SELECT thumbnail, title, id FROM video WHERE id in ?'
  const videoIDs = Array.from(watchedVideoProgress.keys())
  const results = await cluster.execute(query, [videoIDs], { prepare: true })
  for (const row of results.rows) {
    data.push({
      video_id: row.id,
      thumbnail: row.thumbnail,
      title: row.title,
      progress: watchedVideoProgress.get(row.id)
    })
  }
  return {
    props: {
      videos: data
    }
  }
}

export default function ContinueWatching({ videos }) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar title="Continue watching"/>
        <SideBar/>
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
            <Grid container spacing={3}>
              {/* Videos */}
              {videos.map((video) =>
                <Grid item xs={12} md={4} lg={3} key={video.video_id}>
                  <VideoCard 
                    title={video.title}
                    imgSrc={video.thumbnail}
                    videoId={video.video_id}
                    progress={video.progress}
                  />
                </Grid>
              )}
            </Grid>
            <Footer sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
