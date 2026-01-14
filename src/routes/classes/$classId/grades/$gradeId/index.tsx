import type { Lesson, LessonProgress } from '@/lib/database.types'

import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  Play,
} from 'lucide-react'

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
  useFinalTestByGrade,
  useGrade,
  useLessonProgressByGrade,
  useLessonsByGrade,
} from '@/hooks/use-queries'

export const Route = createFileRoute('/classes/$classId/grades/$gradeId/')({
  component: GradeDetailPage,
})

function GradeDetailPage() {
  const { classId, gradeId } = Route.useParams()
  const { user } = useAuth()

  const { data: classData, isLoading: classLoading } = useClass(classId)
  const { data: grade, isLoading: gradeLoading } = useGrade(gradeId)
  const { data: lessons, isLoading: lessonsLoading } =
    useLessonsByGrade(gradeId)
  const { data: enrollment } = useEnrollmentForClass(user?.id, classId)
  const { data: lessonProgress } = useLessonProgressByGrade(user?.id, gradeId)
  const { data: finalTest } = useFinalTestByGrade(gradeId)

  // Calculate progress
  const completedLessons =
    lessonProgress?.filter((p: LessonProgress) => p.status === 'completed')
      .length ?? 0
  const totalLessons = lessons?.length ?? 0
  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const allLessonsCompleted =
    totalLessons > 0 && completedLessons === totalLessons

  // Check if user is enrolled
  if (!classLoading && !enrollment) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Not enrolled</h2>
        <p className="text-muted-foreground mb-4">
          You need to register for this class first.
        </p>
        <Button asChild>
          <Link to="/classes/$classId" params={{ classId }}>
            Go to Class Details
          </Link>
        </Button>
      </div>
    )
  }

  if (classLoading || gradeLoading || lessonsLoading) {
    return <GradeDetailSkeleton />
  }

  if (!classData || !grade) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Grade not found</h2>
        <Button asChild>
          <Link to="/classes/$classId/grades" params={{ classId }}>
            Back to Grades
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/classes/$classId/grades" params={{ classId }}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Grade Selection
        </Link>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link
            to="/classes/$classId"
            params={{ classId }}
            className="hover:underline"
          >
            {classData.title}
          </Link>
          <span>/</span>
          <span>{grade.name}</span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{grade.name}</h1>
        {grade.description && (
          <p className="text-muted-foreground">{grade.description}</p>
        )}
      </div>

      {/* Progress Card */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Lessons Completed</span>
              <span className="font-medium">
                {completedLessons} / {totalLessons}
              </span>
            </div>
            <Progress value={progressPercent} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {allLessonsCompleted
                ? '🎉 All lessons completed! Take the final test to complete this grade.'
                : `${progressPercent}% complete - keep going!`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lessons List */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Lessons
        </h2>
        <div className="space-y-3">
          {lessons?.map((lesson: Lesson, index: number) => {
            const progress = lessonProgress?.find(
              (p: LessonProgress) => p.lesson_id === lesson.id,
            )
            const isCompleted = progress?.status === 'completed'
            const isInProgress = progress?.status === 'in_progress'

            return (
              <Card
                key={lesson.id}
                className={`transition-all hover:border-primary/50 ${
                  isCompleted ? 'border-green-200 bg-green-50/50' : ''
                }`}
              >
                <CardContent className="flex items-center gap-4 py-4">
                  {/* Index / Status Icon */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                      isCompleted
                        ? 'bg-green-100 text-green-700'
                        : isInProgress
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Lesson Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{lesson.title}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.estimated_minutes} min
                      </span>
                      {isInProgress && progress?.time_spent_seconds && (
                        <span>
                          {Math.round(progress.time_spent_seconds / 60)} min
                          spent
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  {isCompleted && (
                    <Badge
                      variant="outline"
                      className="text-green-700 border-green-300"
                    >
                      Completed
                    </Badge>
                  )}
                  {isInProgress && (
                    <Badge
                      variant="outline"
                      className="text-blue-700 border-blue-300"
                    >
                      In Progress
                    </Badge>
                  )}

                  {/* Action Button */}
                  <Button
                    variant={isCompleted ? 'outline' : 'default'}
                    size="sm"
                    asChild
                  >
                    <Link
                      to="/classes/$classId/grades/$gradeId/lessons/$lessonId"
                      params={{ classId, gradeId, lessonId: lesson.id }}
                    >
                      {isCompleted ? (
                        'Review'
                      ) : isInProgress ? (
                        <>
                          Continue
                          <Play className="ml-1 h-3 w-3" />
                        </>
                      ) : (
                        <>
                          Start
                          <Play className="ml-1 h-3 w-3" />
                        </>
                      )}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}

          {(!lessons || lessons.length === 0) && (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <BookOpen className="mx-auto h-10 w-10 mb-3 opacity-50" />
                <p>No lessons available for this grade yet.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Final Test Section */}
      {finalTest && (
        <Card className={allLessonsCompleted ? 'border-primary' : 'opacity-75'}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${
                  allLessonsCompleted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>{finalTest.title}</CardTitle>
                <CardDescription>
                  Complete all lessons to unlock the final test
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <p>Passing score: {finalTest.passing_score}%</p>
                <p>
                  {(finalTest.questions as Array<unknown>)?.length ?? 0}{' '}
                  questions
                </p>
              </div>
              <Button
                disabled={!allLessonsCompleted}
                asChild={allLessonsCompleted}
              >
                {allLessonsCompleted ? (
                  <Link
                    to="/classes/$classId/grades/$gradeId/test"
                    params={{ classId, gradeId }}
                  >
                    Take Test
                  </Link>
                ) : (
                  <>
                    <span>Locked</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function GradeDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="mb-8">
        <Skeleton className="h-4 w-48 mb-2" />
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-96" />
      </div>
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full mb-4" />
          <Skeleton className="h-4 w-48" />
        </CardContent>
      </Card>
      <Skeleton className="h-8 w-24 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="flex items-center gap-4 py-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-9 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
