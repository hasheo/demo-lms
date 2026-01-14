import type { Grade, GradeRequirement } from '@/lib/database.types'

import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Lock, Star } from 'lucide-react'
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
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-context'
import {
  useClass,
  useEnrollmentForClass,
  useGradeRequirements,
  useGrades,
  useUpdateEnrollmentGrade,
} from '@/hooks/use-queries'

export const Route = createFileRoute('/classes/$classId/grades/')({
  component: GradeSelectionPage,
})

function GradeSelectionPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: classData, isLoading: classLoading } = useClass(classId)
  const { data: grades, isLoading: gradesLoading } = useGrades(classId)
  const { data: enrollment, isLoading: enrollmentLoading } =
    useEnrollmentForClass(user?.id, classId)
  const { data: requirements } = useGradeRequirements(classId)

  const updateGrade = useUpdateEnrollmentGrade()

  // Check if user is enrolled
  if (!enrollmentLoading && !enrollment) {
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

  const handleSelectGrade = async (gradeId: string) => {
    if (!enrollment || !user) return

    try {
      await updateGrade.mutateAsync({
        enrollmentId: enrollment.id,
        gradeId,
        userId: user.id,
      })
      toast.success('Grade selected!')
      navigate({
        to: '/classes/$classId/grades/$gradeId',
        params: { classId, gradeId },
      })
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to select grade'
      toast.error(message)
    }
  }

  // Check if a grade is unlocked based on requirements
  const isGradeUnlocked = (gradeId: string, gradeOrder: number): boolean => {
    // First grade is always unlocked
    if (gradeOrder === 0) return true

    // For now, allow all grades if no requirements system
    // In a full implementation, check if previous grade requirements are met
    const gradeReqs = requirements?.filter(
      (r: GradeRequirement) => r.grade_id === gradeId,
    )

    // If no requirements defined, grade is unlocked
    if (!gradeReqs || gradeReqs.length === 0) return true

    // TODO: Check actual completion status
    // For demo, unlock all grades
    return true
  }

  if (classLoading || gradesLoading || enrollmentLoading) {
    return <GradeSelectionSkeleton />
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link to="/classes/$classId" params={{ classId }}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {classData.title}
        </Link>
      </Button>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Select Your Grade</h1>
        <p className="text-muted-foreground">
          Choose the grade level that matches your current skill level
        </p>
      </div>

      {/* Current Grade Indicator */}
      {enrollment?.current_grade_id && grades && (
        <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <p className="text-sm text-muted-foreground">Currently selected:</p>
          <p className="font-semibold text-primary">
            {
              grades.find((g: Grade) => g.id === enrollment.current_grade_id)
                ?.name
            }
          </p>
        </div>
      )}

      {/* Grades List */}
      <div className="space-y-4">
        {grades?.map((grade: Grade, index: number) => {
          const isUnlocked = isGradeUnlocked(grade.id, index)
          const isCurrentGrade = enrollment?.current_grade_id === grade.id

          return (
            <Card
              key={grade.id}
              className={`transition-all ${
                isCurrentGrade
                  ? 'ring-2 ring-primary'
                  : isUnlocked
                    ? 'hover:border-primary/50 cursor-pointer'
                    : 'opacity-60'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold ${
                        isCurrentGrade
                          ? 'bg-primary text-primary-foreground'
                          : isUnlocked
                            ? 'bg-primary/10 text-primary'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {isUnlocked ? index + 1 : <Lock className="h-4 w-4" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {grade.name}
                        {isCurrentGrade && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </CardTitle>
                      {grade.description && (
                        <CardDescription className="mt-1">
                          {grade.description}
                        </CardDescription>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div>
                    {isCurrentGrade ? (
                      <Button asChild>
                        <Link
                          to="/classes/$classId/grades/$gradeId"
                          params={{ classId, gradeId: grade.id }}
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    ) : isUnlocked ? (
                      <Button
                        variant="outline"
                        onClick={() => handleSelectGrade(grade.id)}
                        disabled={updateGrade.isPending}
                      >
                        Select
                      </Button>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        <Lock className="mr-1 h-3 w-3" />
                        Locked
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              {/* Grade Requirements Preview */}
              {requirements && (
                <CardContent className="pt-0">
                  <GradeRequirementsPreview
                    gradeId={grade.id}
                    grades={grades}
                    requirements={requirements}
                  />
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function GradeRequirementsPreview({
  gradeId,
  grades,
  requirements,
}: {
  gradeId: string
  grades: Array<Grade>
  requirements: Array<GradeRequirement>
}) {
  const gradeReqs = requirements.filter((r) => r.grade_id === gradeId)

  if (gradeReqs.length === 0) return null

  return (
    <div className="text-sm text-muted-foreground border-t pt-3 mt-3">
      <p className="font-medium mb-2">Requirements to unlock:</p>
      <ul className="space-y-1">
        {gradeReqs.map((req) => {
          const requiredGrade = grades.find(
            (g) => g.id === req.required_grade_id,
          )
          return (
            <li key={req.id} className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>
                {requiredGrade
                  ? `Complete "${requiredGrade.name}" with ${req.min_score}% score`
                  : `Score ${req.min_score}% or higher on previous test`}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function GradeSelectionSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Skeleton className="h-8 w-32 mb-6" />
      <div className="text-center mb-8">
        <Skeleton className="h-10 w-64 mx-auto mb-2" />
        <Skeleton className="h-5 w-96 mx-auto" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-32 mb-2" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-9 w-24" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
