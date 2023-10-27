import { Alert, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Link from 'next/link';
import Footer from "src/components/Footer";
import SideBar from "src/components/menu/SideBar";
import TopBar from "src/components/menu/TopBar";
import VideoCard from 'src/components/VideoCard';
import { Video } from 'src/types';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export async function getServerSideProps() {
  const continueUrl = process.env.APP_BASE_URL + '/api/list-continue';
  const videosResponse: Partial<Video[]> = await (await fetch(continueUrl)).json();

  return {
    props: { videos: videosResponse }
  }
}

function NoVideoAvailable() {
  return (
    <Alert severity='warning'>
      No video watched so far. Go to the <Link href="/">home</Link> and watch something!
    </Alert>
  )
}

interface ContinueWatchingProps {
  videos: Video[]
}

export default function ContinueWatching({ videos }: ContinueWatchingProps) {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <TopBar title="Continue watching" />
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
            <Typography variant="h3" component="h1" sx={{ mb: 4}}>
              List of videos which you started
            </Typography>

            {!videos.length && <NoVideoAvailable/>}

            <Grid container spacing={3}>
              {/* Videos */}
              {videos.map((video) =>
                <Grid item xs={12} md={4} lg={3} key={video.video_id}>
                  <VideoCard video={video}/>
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
