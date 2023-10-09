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
  let data: Object[] = [];
  const results = await cluster.execute("SELECT thumbnail, title, id FROM streaming.video LIMIT 9;");
  for (const row of results.rows) {
    data.push({
      video_id: row.id,
      thumbnail: row.thumbnail,
      title: row.title,
    })
  }
  return {
    props: {
      videos: data
    }
  }
}

export default function AllVideos({ videos }) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar title="All videos"/>
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
                    progress={0}
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
