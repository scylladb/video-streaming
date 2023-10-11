import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

export default function VideoCard({ title, imgSrc, videoId, progress }: { title: string; imgSrc: string; videoId: string; progress: number }) {
  const watchUrl = `/watch/${videoId}?progress=${progress}`
  return (
    <Card>
      <Image
        alt={title}
        src={imgSrc}
        width={640}
        height={480}
        style={{
          maxWidth: '100%',
          height: '200px',
          objectFit: 'cover',
        }}
      />
      {/* <LinearProgress color="secondary" /> */}
      <CardContent>
        <Typography gutterBottom variant="body1" component="div" style={{minHeight:72}}>
          {title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button href={ watchUrl } size="small">Watch</Button>
      </CardActions>
    </Card>
  );
}
