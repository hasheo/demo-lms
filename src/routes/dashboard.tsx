import { Link, createFileRoute } from '@tanstack/react-router'
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  PlayCircle,
  Trophy,
} from 'lucide-react'
import type {
  EnrollmentWithClass,
  JourneyEventWithClass,
} from '@/lib/database.types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/auth-context'
import {
  useActiveEnrollments,
  useCompletedEnrollments,
  useJourneyEvents,
} from '@/hooks/use-queries'
import { formatDistanceToNow } from '@/lib/format'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Please sign in to access your dashboard
        </h2>
        <Button asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    )
  }

  const { data: activeEnrollments, isLoading: activeLoading } =
    useActiveEnrollments(user?.id)
  const { data: completedEnrollments, isLoading: completedLoading } =
    useCompletedEnrollments(user?.id)
  const { data: journeyEvents, isLoading: eventsLoading } = useJourneyEvents(
    user?.id,
  )

  if (authLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Track your learning progress here.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Active Classes
            </CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                (activeEnrollments?.length ?? 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Classes
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                (completedEnrollments?.length ?? 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Activities
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventsLoading ? (
                <Skeleton className="h-8 w-8" />
              ) : (
                (journeyEvents?.length ?? 0)
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Current Classes</TabsTrigger>
          <TabsTrigger value="completed">Class History</TabsTrigger>
          <TabsTrigger value="journey">Learning Journey</TabsTrigger>
        </TabsList>

        {/* Active Enrollments Tab */}
        <TabsContent value="active" className="space-y-4">
          {activeLoading ? (
            <EnrollmentsSkeleton />
          ) : activeEnrollments && activeEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeEnrollments.map((enrollment: EnrollmentWithClass) => (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-1">
                          {enrollment.classes.title}
                        </CardTitle>
                        <CardDescription>
                          Enrolled {formatDistanceToNow(enrollment.enrolled_at)}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {enrollment.classes.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link
                        to="/classes/$classId"
                        params={{ classId: enrollment.class_id }}
                      >
                        Continue Learning
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<BookOpen className="h-12 w-12" />}
              title="No active classes"
              description="Browse the catalog to enroll in a class"
              action={
                <Button asChild>
                  <Link to="/classes">Browse Classes</Link>
                </Button>
              }
            />
          )}
        </TabsContent>

        {/* Completed Enrollments Tab */}
        <TabsContent value="completed" className="space-y-4">
          {completedLoading ? (
            <EnrollmentsSkeleton />
          ) : completedEnrollments && completedEnrollments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {completedEnrollments.map((enrollment: EnrollmentWithClass) => (
                <Card key={enrollment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-1">
                          {enrollment.classes.title}
                        </CardTitle>
                        <CardDescription>
                          Completed{' '}
                          {enrollment.completed_at
                            ? formatDistanceToNow(enrollment.completed_at)
                            : 'recently'}
                        </CardDescription>
                      </div>
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Completed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {enrollment.classes.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link
                        to="/classes/$classId"
                        params={{ classId: enrollment.class_id }}
                      >
                        View Class
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Trophy className="h-12 w-12" />}
              title="No completed classes yet"
              description="Complete your first class to see it here"
            />
          )}
        </TabsContent>

        {/* Learning Journey Tab */}
        <TabsContent value="journey" className="space-y-4">
          {eventsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : journeyEvents && journeyEvents.length > 0 ? (
            <div className="space-y-4">
              {journeyEvents.map((event: JourneyEventWithClass) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="p-2 rounded-full bg-muted">
                    {getEventIcon(event.event_type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{getEventTitle(event)}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.classes?.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(event.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Calendar className="h-12 w-12" />}
              title="No learning activity yet"
              description="Start learning to see your journey here"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function getEventIcon(eventType: string) {
  switch (eventType) {
    case 'enrollment_started':
      return <BookOpen className="h-4 w-4" />
    case 'lesson_completed':
      return <CheckCircle2 className="h-4 w-4" />
    case 'test_passed':
    case 'test_failed':
      return <GraduationCap className="h-4 w-4" />
    case 'grade_completed':
    case 'class_completed':
      return <Trophy className="h-4 w-4" />
    default:
      return <Calendar className="h-4 w-4" />
  }
}

function getEventTitle(event: JourneyEventWithClass) {
  const metadata = event.metadata as Record<string, unknown> | null
  switch (event.event_type) {
    case 'enrollment_started':
      return 'Enrolled in class'
    case 'lesson_completed':
      return `Completed lesson: ${(metadata?.lesson_title as string) || 'Unknown'}`
    case 'test_passed':
      return `Passed test - Score: ${metadata?.score}%`
    case 'test_failed':
      return `Test attempt - Score: ${metadata?.score}%`
    case 'grade_completed':
      return 'Completed grade'
    case 'class_completed':
      return 'Completed class!'
    default:
      return 'Activity'
  }
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="text-center py-12">
      <div className="text-muted-foreground mb-4 flex justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action}
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-6 w-72 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-10 w-96 mb-4" />
      <EnrollmentsSkeleton />
    </div>
  )
}

function EnrollmentsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
