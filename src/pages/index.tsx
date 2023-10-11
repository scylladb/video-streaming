import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Footer from "src/components/Footer";
import SideBar from "src/components/menu/SideBar";
import TopBar from "src/components/menu/TopBar";
import VideoCard from 'src/components/VideoCard';
import { Video } from 'src/types';


// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export async function getServerSideProps() {
  
  const continueUrl = process.env.APP_BASE_URL + '/api/list-videos';
  const videosResponse: Video[] = await (await fetch(continueUrl)).json()

  return {
    props: {
      videos: videosResponse
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
