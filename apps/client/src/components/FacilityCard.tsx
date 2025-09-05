import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import {
  TooltipProvider,
} from "@reservatior/ui/tooltip";
import type { Facility } from "@reservatior/validators";
import { motion } from "framer-motion";
import {
  CreditCard,
  DollarSign,
  Eye,
  Image as ImageIcon,
  MapPin,
  MoreHorizontal,
  Package,
  Pencil,
  Sparkles,
  Trash2,
} from "lucide-react";
import React from "react";

const PLACEHOLDER_IMG =
  "https://source.unsplash.com/600x400/?building,architecture,facility";

interface FacilityCardProps {
  facility: Facility;
  onEdit?: (facility: Facility) => void;
  onDelete?: (facilityId: string) => void;
  onView?: (facility: Facility) => void;
  onSelect?: () => void;
  isSelected?: boolean;
  expenseCount?: number;
  serviceCount?: number;
  extraChargeCount?: number;
  showActions?: boolean;
}

const FacilityStatusBadge = ({ status }: { status: string }) => (
  <Badge
    variant={status === "ACTIVE" ? "default" : "secondary"}
    className={`rounded-full px-3 py-1 text-xs font-medium ${
      status === "ACTIVE"
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
        : "bg-gradient-to-r from-neutral-400 to-neutral-500 text-white shadow-lg"
    }`}
  >
    <div className="mr-1.5 h-2 w-2 rounded-full bg-current opacity-75"></div>
    {status === "ACTIVE" ? "Active" : "Inactive"}
  </Badge>
);

const FacilityTypeBadge = ({ type }: { type: string }) => (
  <Badge
    variant="outline"
    className="rounded-full border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1 text-xs font-medium text-blue-700 shadow-sm dark:border-blue-800 dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300"
  >
    {type.replace(/_/g, " ")}
  </Badge>
);

const StatBadge = ({
  icon: Icon,
  count,
  label,
  color = "blue",
}: {
  icon: React.ElementType;
  count: number;
  label: string;
  color?: "blue" | "green" | "purple" | "orange";
}) => {
  const colorClasses = {
    blue: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 shadow-sm dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-300 dark:border-blue-800",
    green:
      "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 shadow-sm dark:from-green-900/20 dark:to-green-800/20 dark:text-green-300 dark:border-green-800",
    purple:
      "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-purple-200 shadow-sm dark:from-purple-900/20 dark:to-purple-800/20 dark:text-purple-300 dark:border-purple-800",
    orange:
      "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200 shadow-sm dark:from-orange-900/20 dark:to-orange-800/20 dark:text-orange-300 dark:border-orange-800",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all duration-200 ${colorClasses[color]}`}
    >
      <Icon className="h-4 w-4" />
      <div className="flex flex-col">
        <span className="text-lg font-bold">{count}</span>
        <span className="text-xs opacity-75">{label}</span>
      </div>
    </motion.div>
  );
};

const FacilityCard = ({
  facility,
  onEdit,
  onDelete,
  onView,
  onSelect: _onSelect,
  isSelected: _isSelected,
  expenseCount = 0,
  serviceCount = 0,
  extraChargeCount = 0,
  showActions = true,
}: FacilityCardProps) => {
  const photoUrl = (facility.logo ?? facility.icon) ?? PLACEHOLDER_IMG;

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="group relative"
      >
        <Card className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-0 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          {/* Gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-blue-950/20 dark:to-purple-950/20" />

          {/* Facility Image */}
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
            {photoUrl ? (
              <motion.img
                src={photoUrl}
                alt={facility.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMG)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center text-neutral-400 dark:text-neutral-600">
                <ImageIcon className="mb-2 h-12 w-12" />
                <span className="text-sm">No Image</span>
              </div>
            )}

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

            {/* Status badge over image */}
            <div className="absolute left-3 top-3">
              <FacilityStatusBadge status={facility.status} />
            </div>

            {/* Action buttons overlay */}
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                className="absolute right-3 top-3"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white dark:bg-neutral-900/90 dark:hover:bg-neutral-900"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {onView && (
                      <DropdownMenuItem
                        onClick={() => {
                          console.log(
                            "View dropdown clicked for facility:",
                            facility.id,
                          );
                          onView(facility);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    )}
                    {onEdit && (
                      <DropdownMenuItem onClick={() => onEdit(facility)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit Facility
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {onDelete && (
                      <DropdownMenuItem
                        onClick={() => onDelete(facility.id)}
                        className="text-red-600 focus:text-red-600 dark:text-red-400"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Facility
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </div>

          <CardHeader className="space-y-3 p-6 pb-4">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="line-clamp-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">
                  {facility.name}
                </CardTitle>
                <p className="mt-2 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                  {facility.description ?? "No description available"}
                </p>
              </div>
            </div>

            {/* Type badge */}
            <div className="flex items-center gap-2">
              <FacilityTypeBadge type={facility.type} />
              {facility.locationId && (
                <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <MapPin className="h-3 w-3" />
                  <span>Location ID: {facility.locationId}</span>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <StatBadge
                icon={DollarSign}
                count={expenseCount}
                label="Expenses"
                color="blue"
              />
              <StatBadge
                icon={Package}
                count={serviceCount}
                label="Services"
                color="green"
              />
              <StatBadge
                icon={CreditCard}
                count={extraChargeCount}
                label="Charges"
                color="purple"
              />
            </div>

            {/* Quick Actions */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    alert(`Button clicked for facility: ${facility.name}`);
                    console.log("=== VIEW BUTTON CLICKED ===");
                    console.log("Facility:", facility.name);
                    console.log("onView function:", onView);
                    if (onView) {
                      console.log("Calling onView function...");
                      onView(facility);
                      console.log("onView function called successfully");
                    } else {
                      console.error("onView function is not provided!");
                    }
                  }}
                  className="rounded-lg border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  style={{ position: "relative", zIndex: 1000 }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(facility)}
                    className="rounded-lg border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>

              {/* Sparkles indicator for premium features */}
              {facility.status === "ACTIVE" && (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-yellow-500"
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default FacilityCard;
