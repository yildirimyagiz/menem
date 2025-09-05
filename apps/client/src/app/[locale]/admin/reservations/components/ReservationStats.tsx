import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import { useTranslations } from "next-intl";

interface ReservationStatsProps {
  stats?: {
    totalReservations: number;
    activeReservations: number;
    cancelledReservations: number;
    completedReservations: number;
  };
}

export const ReservationStats: React.FC<ReservationStatsProps> = ({
  stats,
}) => {
  const t = useTranslations("Admin");
  
  if (!stats) {
    return <div className="text-gray-400">{t("reservations.noStats", { defaultValue: "No stats available" })}</div>;
  }
  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("reservations.stats.total", { defaultValue: "Total Reservations" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{stats.totalReservations}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("reservations.stats.active", { defaultValue: "Active" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{stats.activeReservations}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("reservations.stats.completed", { defaultValue: "Completed" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{stats.completedReservations}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("reservations.stats.cancelled", { defaultValue: "Cancelled" })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl">{stats.cancelledReservations}</div>
        </CardContent>
      </Card>
    </div>
  );
};
