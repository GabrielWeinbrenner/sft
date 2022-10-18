import Card from '@mui/material/Card';
//import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
//import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function BasicCard({imageSrc, text}) {
  return imageSrc && (
    <Card sx={{ maxWidth: 350 }}>
      <CardMedia component="img" height="300" src={imageSrc} alt={text}/>
      <CardContent>
        <Typography variant="body2">
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}