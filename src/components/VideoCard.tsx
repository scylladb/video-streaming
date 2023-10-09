import * as React from 'react';
import Image from 'next/image';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function VideoCard({ title, imgSrc, videoId, progress }: { title: string; imgSrc: string; videoId: string; progress: number }) {
  const watchUrl = `/watch?videoId=${videoId}&progress=${progress||0}`
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
      <CardContent>
        <Typography gutterBottom variant="body1" component="div">
          {title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button href={ watchUrl } size="small">Watch</Button>
      </CardActions>
    </Card>
  );
}
