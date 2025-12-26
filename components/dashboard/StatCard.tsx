import { Card, CardContent } from "../ui/card";

const StatCard = ({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: any;
  subtitle: string;
}) =>{
  return (
    <Card className="relative overflow-hidden bg-card/80 backdrop-blur-sm
  shadow-[0_10px_30px_-10px_rgba(59,130,246,0.35)]
  hover:shadow-[0_20px_45px_-15px_rgba(59,130,246,0.45)]
  transition-shadow">

    
      <div className="absolute inset-x-0 top-0 h-1 bg-blue-500/60" />


      <CardContent className="pt-6 space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}



export default StatCard;