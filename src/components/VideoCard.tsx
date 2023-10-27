import { LinearProgress } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import { Video } from 'src/types';

export default function VideoCard({video}: {video: Video}) {
  const watchUrl = `/watch/${video.video_id}?progress=${video.progress}`
  const progressPercentage = Math.floor((video.progress / video.duration) * 100);

  return (
    <Card>
      <Image
        alt={video.title}
        src={video.thumbnail}
        width={640}
        height={480}
        style={{
          maxWidth: '100%',
          height: '200px',
          objectFit: 'cover',
        }}
      />
      <LinearProgress variant="determinate" value={progressPercentage} />
      <CardContent>
        
        <Typography gutterBottom variant="body1" component="div" style={{minHeight:72}}>
          {video.title}
        </Typography>
        
      </CardContent>
      <CardActions>
        <Button href={ watchUrl } size="small">Watch</Button>
      </CardActions>
    </Card>
  );
}
