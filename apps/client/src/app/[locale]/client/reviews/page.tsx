"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Award,
  BarChart3,
  Building2,
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  Filter,
  Heart,
  Home,
  MapPin,
  MessageCircle,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Star,
  Target,
  ThumbsUp,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@reservatior/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@reservatior/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@reservatior/ui/tabs";

// AceternityUI-inspired components
const BackgroundGradient = () => (
  <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)] dark:bg-neutral-950 dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]" />
);

const FloatingNav = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="sticky top-4 z-50 mb-8 rounded-2xl border border-neutral-200/50 bg-white/80 backdrop-blur-xl dark:border-neutral-800/50 dark:bg-neutral-900/80"
  >
    {children}
  </motion.div>
);

const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  className,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: number; isPositive: boolean };
  className?: string;
  subtitle?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`group relative overflow-hidden rounded-xl border border-neutral-200/50 bg-white/50 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-neutral-800/50 dark:bg-neutral-900/50 ${className}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center space-x-1">
              <TrendingUp
                className={`h-4 w-4 ${
                  trend.isPositive ? "text-green-500" : "text-red-500"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  trend.isPositive
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  </motion.div>
);

const ReviewCard = ({
  review,
  onEdit,
  onDelete,
  onView,
}: {
  review: any;
  onEdit: (review: any) => void;
  onDelete: (review: any) => void;
  onView: (review: any) => void;
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "REJECTED":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return CheckCircle;
      case "PENDING":
        return Clock;
      case "REJECTED":
        return XCircle;
      default:
        return AlertCircle;
    }
  };

  const StatusIcon = getStatusIcon(review.status);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative overflow-hidden rounded-xl border border-neutral-200/50 bg-white/50 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl dark:border-neutral-800/50 dark:bg-neutral-900/50"
    >
      <div className="p-6">
        <div className="flex gap-6">
          {/* Property Image */}
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
            <img
              src={review.propertyImage}
              alt={review.propertyTitle}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Review Content */}
          <div className="flex-1">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  {review.propertyTitle}
                </h3>
                <div className="mb-2 flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    {review.propertyType}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {review.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(review.date)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(review.status)}>
                  <StatusIcon className="mr-1 h-3 w-3" />
                  {review.status}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200/50 bg-white/50 text-neutral-600 transition-all duration-200 hover:bg-white/80 hover:text-neutral-900 dark:border-neutral-700/50 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-100"
                    >
                      <Edit className="h-4 w-4" />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(review)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Review
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 dark:text-red-400"
                      onClick={() => onDelete(review)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Review
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Rating and Content */}
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex">{renderStars(review.rating)}</div>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {review.rating}/5
                </span>
              </div>
              <h4 className="mb-2 font-medium text-neutral-900 dark:text-white">
                {review.title}
              </h4>
              <p className="line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
                {review.content}
              </p>
            </div>

            {/* Actions and Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {review.helpful} helpful
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {review.replies} replies
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-lg border border-neutral-200/50 bg-white/50 px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white/80 hover:text-neutral-900 dark:border-neutral-700/50 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-100"
                onClick={() => onView(review)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Property
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function ReviewsPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState("all");

  const mockReviews = [
    {
      id: "1",
      propertyTitle: "Downtown Apartment Complex",
      propertyImage: "/api/placeholder/400/300",
      rating: 5,
      title: "Excellent Location and Amenities",
      content:
        "This apartment complex exceeded my expectations. The location is perfect for downtown access, and the amenities are top-notch. The gym is well-equipped, and the pool area is beautiful. The management team is responsive and helpful.",
      date: "2024-01-15",
      helpful: 12,
      replies: 2,
      status: "PUBLISHED",
      propertyType: "Apartment",
      location: "Downtown, City Center",
    },
    {
      id: "2",
      propertyTitle: "Suburban Family Home",
      propertyImage: "/api/placeholder/400/300",
      rating: 4,
      title: "Great Family Home with Minor Issues",
      content:
        "Overall, this is a wonderful family home. The neighborhood is quiet and safe, perfect for raising children. The house itself is spacious and well-maintained. The only minor issue is that the kitchen could use some updates, but it's functional.",
      date: "2024-01-10",
      helpful: 8,
      replies: 1,
      status: "PUBLISHED",
      propertyType: "House",
      location: "Suburban Area",
    },
    {
      id: "3",
      propertyTitle: "University District Studio",
      propertyImage: "/api/placeholder/400/300",
      rating: 3,
      title: "Decent for Students, Could Be Better",
      content:
        "The location is perfect for university students, and the rent is reasonable. However, the apartment is quite small and the building is a bit old. The heating system works well, but the kitchen appliances are outdated.",
      date: "2024-01-05",
      helpful: 5,
      replies: 0,
      status: "PENDING",
      propertyType: "Studio",
      location: "University District",
    },
    {
      id: "4",
      propertyTitle: "Luxury Condo",
      propertyImage: "/api/placeholder/400/300",
      rating: 5,
      title: "Luxury Living at Its Finest",
      content:
        "This luxury condo is absolutely stunning. The finishes are high-end, the views are spectacular, and the amenities are world-class. The concierge service is exceptional, and the building security is top-notch. Worth every penny!",
      date: "2024-01-01",
      helpful: 15,
      replies: 3,
      status: "PUBLISHED",
      propertyType: "Condo",
      location: "Premium District",
    },
  ];

  const filteredReviews = mockReviews.filter((review) => {
    if (activeTab === "all") return true;
    return review.status.toLowerCase() === activeTab;
  });

  const handleEdit = (review: any) => {
    console.log("Edit review:", review);
  };

  const handleDelete = (review: any) => {
    console.log("Delete review:", review);
  };

  const handleView = (review: any) => {
    console.log("View property:", review);
  };

  const averageRating = (
    mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length
  ).toFixed(1);

  const totalHelpful = mockReviews.reduce((sum, r) => sum + r.helpful, 0);
  const publishedCount = mockReviews.filter(
    (r) => r.status === "PUBLISHED",
  ).length;

  return (
    <div className="relative min-h-screen">
      <BackgroundGradient />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FloatingNav>
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  My Reviews
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  View and manage your property reviews
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              <span>Write Review</span>
            </motion.button>
          </div>
        </FloatingNav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Reviews"
              value={mockReviews.length}
              icon={Star}
              className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-950/50 dark:to-orange-900/50"
            />
            <StatsCard
              title="Average Rating"
              value={averageRating}
              icon={Award}
              subtitle="out of 5 stars"
              className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/50 dark:to-emerald-900/50"
            />
            <StatsCard
              title="Published"
              value={publishedCount}
              icon={CheckCircle}
              trend={{ value: 12, isPositive: true }}
              className="bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-950/50 dark:to-cyan-900/50"
            />
            <StatsCard
              title="Total Helpful"
              value={totalHelpful}
              icon={Heart}
              trend={{ value: 8, isPositive: true }}
              className="bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-950/50 dark:to-rose-900/50"
            />
          </div>

          {/* Reviews Section */}
          <div className="rounded-2xl border border-neutral-200/50 bg-white/50 shadow-xl backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-900/50">
            <div className="flex items-center justify-between border-b border-neutral-200/50 p-6 dark:border-neutral-700/50">
              <div className="flex items-center space-x-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                    Property Reviews
                  </h2>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {filteredReviews.length} reviews found
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rounded-lg border border-neutral-200/50 bg-white/50 px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white/80 dark:border-neutral-700/50 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 rounded-lg border border-neutral-200/50 bg-white/50 px-4 py-2 text-sm font-medium text-neutral-700 transition-all duration-200 hover:bg-white/80 dark:border-neutral-700/50 dark:bg-neutral-800/50 dark:text-neutral-300 dark:hover:bg-neutral-800/80"
                >
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </motion.button>
              </div>
            </div>

            <div className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 bg-neutral-100/50 dark:bg-neutral-800/50">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                  >
                    All Reviews
                  </TabsTrigger>
                  <TabsTrigger
                    value="published"
                    className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                  >
                    Published
                  </TabsTrigger>
                  <TabsTrigger
                    value="pending"
                    className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger
                    value="rejected"
                    className="data-[state=active]:bg-white data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-700 dark:data-[state=active]:text-white"
                  >
                    Rejected
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  <AnimatePresence mode="wait">
                    {filteredReviews.length > 0 ? (
                      <motion.div
                        key="reviews"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                      >
                        {filteredReviews.map((review, index) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <ReviewCard
                              review={review}
                              onEdit={handleEdit}
                              onDelete={handleDelete}
                              onView={handleView}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-neutral-200/50 bg-white/50 p-12 text-center backdrop-blur-sm dark:border-neutral-800/50 dark:bg-neutral-900/50"
                      >
                        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
                          <Star className="h-8 w-8 text-neutral-400" />
                        </div>
                        <h3 className="mb-2 text-lg font-medium text-neutral-900 dark:text-white">
                          No reviews found
                        </h3>
                        <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                          Start reviewing properties to help other users make
                          informed decisions
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex items-center space-x-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:shadow-xl"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Write a Review</span>
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
