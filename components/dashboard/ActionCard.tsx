import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
const ActionCard = ({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) =>{
  return (
    <Link href={href}>
      <Card className="group relative transition cursor-pointer
  bg-card/80 backdrop-blur-sm
  shadow-[0_8px_25px_-10px_rgba(59,130,246,0.25)]
  hover:shadow-[0_16px_40px_-12px_rgba(59,130,246,0.4)]
  hover:border-blue-500/40">

        <CardContent className="pt-6 space-y-2">
          <p className="font-semibold group-hover:text-primary">
            {title}
          </p>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
export default ActionCard;