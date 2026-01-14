import { Link, createFileRoute } from '@tanstack/react-router'
import { BookOpen } from 'lucide-react'
import type { Class, EnrollmentWithClass } from '@/lib/database.types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-context'
import { useClasses, useEnrollments } from '@/hooks/use-queries'

export const Route = createFileRoute('/classes/')({
  component: ClassesPage,
})

function ClassesPage() {
  const { user } = useAuth()
  const { data: classes, isLoading: classesLoading, error } = useClasses()
  const { data: enrollments } = useEnrollments(user?.id)

  // Create a map of classId -> enrollment for quick lookup
  const enrollmentMap = new Map<string, EnrollmentWithClass>()
  enrollments?.forEach((enrollment: EnrollmentWithClass) => {
    enrollmentMap.set(enrollment.class_id, enrollment)
  })

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-destructive">
            Failed to load classes. Please try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Class Catalog</h1>
        <p className="text-muted-foreground">
          Browse our available classes and start your learning journey
        </p>
      </div>

      {/* Classes Grid */}
      {classesLoading ? (
        <ClassesGridSkeleton />
      ) : classes && classes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls: Class) => {
            const enrollment = enrollmentMap.get(cls.id)
            const isEnrolled = !!enrollment
            const isCompleted = enrollment?.status === 'completed'

            return (
              <Card key={cls.id} className="flex flex-col overflow-hidden">
                {cls.thumbnail_url && (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={cls.thumbnail_url}
                      alt={cls.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{cls.title}</CardTitle>
                    {isEnrolled && (
                      <Badge
                        variant={isCompleted ? 'default' : 'secondary'}
                        className="shrink-0"
                      >
                        {isCompleted ? 'Completed' : 'Enrolled'}
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-3">
                    {cls.description}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to="/classes/$classId" params={{ classId: cls.id }}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      {isEnrolled ? 'Continue' : 'View Class'}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No classes available</h3>
          <p className="text-muted-foreground">
            Check back later for new classes.
          </p>
        </div>
      )}
    </div>
  )
}

function ClassesGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <Skeleton className="h-40 w-full rounded-t-lg rounded-b-none" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full mt-2" />
            <Skeleton className="h-4 w-2/3 mt-1" />
          </CardHeader>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
