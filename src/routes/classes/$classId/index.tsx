import type { Grade, Lesson, LessonProgress } from '@/lib/database.types'

import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  Loader2,
  Play,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-context'
import {
  useClass,
  useEnrollmentForClass,
  useGrades,
  useLessonProgressByClass,
  useLessons,
  useRegisterClass,
} from '@/hooks/use-queries'

export const Route = createFileRoute('/classes/$classId/')({
  component: ClassDetailPage,
})

function ClassDetailPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const { data: classData, isLoading: classLoading } = useClass(classId)
  const { data: grades, isLoading: gradesLoading } = useGrades(classId)
  const { data: lessons } = useLessons(classId)
  const { data: enrollment, isLoading: enrollmentLoading } =
    useEnrollmentForClass(user?.id, classId)
  const { data: lessonProgress } = useLessonProgressByClass(user?.id, classId)

  const registerClass = useRegisterClass()

  const isEnrolled = !!enrollment
  const isCompleted = enrollment?.status === 'completed'

  // Calculate progress
  const completedLessons =
    lessonProgress?.filter((p: LessonProgress) => p.status === 'completed')
      .length ?? 0
  const totalLessons = lessons?.length ?? 0
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const handleRegister = async () => {
    if (!user) {
      toast.error('Please sign in to register for this class')
      navigate({ to: '/login' })
      return
    }

    try {
      await registerClass.mutateAsync({
        userId: user.id,
        classId,
      })
      toast.success('Successfully registered for this class!')
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to register'
      toast.error(message)
    }
  }

  if (classLoading || gradesLoading || enrollmentLoading) {
    return <ClassDetailSkeleton />
  }

  if (!classData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Class not found</h2>
        <Button asChild>
          <Link to="/classes">Back to Catalog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/classes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Link>
      </Button>

      {/* Class Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          {classData.thumbnail_url && (
            <div className="h-48 md:h-64 rounded-lg overflow-hidden mb-6">
              <img
                src={classData.thumbnail_url}
                alt={classData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold">{classData.title}</h1>
            {isEnrolled && (
              <Badge variant={isCompleted ? 'default' : 'secondary'}>
                {isCompleted ? 'Completed' : 'Enrolled'}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            {classData.description}
          </p>
        </div>

        {/* Action Card */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {isEnrolled ? 'Your Progress' : 'Get Started'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEnrolled ? (
                <>
                  {/* Progress Summary */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Lessons Completed</span>
                      <span className="font-medium">
                        {completedLessons} / {totalLessons}
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                    <p className="text-xs text-muted-foreground text-right">
                      {progressPercent}% complete
                    </p>
                  </div>

                  {/* Current Grade */}
                  {enrollment?.current_grade_id && grades && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground mb-1">
                        Current Grade
                      </p>
                      <p className="font-medium">
                        {grades.find(
                          (g: Grade) => g.id === enrollment.current_grade_id,
                        )?.name ?? 'Not selected'}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button className="w-full" asChild>
                    <Link to="/classes/$classId/grades" params={{ classId }}>
                      <Play className="mr-2 h-4 w-4" />
                      Go to Grade Selection
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-center py-4">
                    <GraduationCap className="mx-auto h-12 w-12 text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Register now to start learning
                    </p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={handleRegister}
                    disabled={registerClass.isPending}
                  >
                    {registerClass.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <BookOpen className="mr-2 h-4 w-4" />
                        Register for Class
                      </>
                    )}
                  </Button>
                  {!isAuthenticated && (
                    <p className="text-xs text-muted-foreground text-center">
                      You'll need to{' '}
                      <Link to="/login" className="underline">
                        sign in
                      </Link>{' '}
                      first
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grades Section */}
      {grades && grades.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Grades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {grades.map((grade: Grade, index: number) => (
              <Card key={grade.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <CardTitle className="text-base">{grade.name}</CardTitle>
                  </div>
                </CardHeader>
                {grade.description && (
                  <CardContent className="pt-0">
                    <CardDescription>{grade.description}</CardDescription>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Lessons Summary */}
      {lessons && lessons.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            Lessons ({lessons.length})
          </h2>
          <div className="space-y-2">
            {lessons.slice(0, 5).map((lesson: Lesson, index: number) => {
              const progress = lessonProgress?.find(
                (p: LessonProgress) => p.lesson_id === lesson.id,
              )
              const isLessonCompleted = progress?.status === 'completed'

              return (
                <div
                  key={lesson.id}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm">
                    {isLessonCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.estimated_minutes} min
                    </p>
                  </div>
                  {isEnrolled && isLessonCompleted && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      Done
                    </Badge>
                  )}
                </div>
              )
            })}
            {lessons.length > 5 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                +{lessons.length - 5} more lessons
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ClassDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-48 md:h-64 w-full rounded-lg mb-6" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3 mt-2" />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
