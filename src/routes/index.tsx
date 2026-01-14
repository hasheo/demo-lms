import { Link, createFileRoute } from '@tanstack/react-router'
import { BookOpen, GraduationCap, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/auth-context'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: <BookOpen className="w-10 h-10 text-primary" />,
      title: 'Rich Course Catalog',
      description:
        'Browse and enroll in a variety of classes across different subjects and skill levels.',
    },
    {
      icon: <GraduationCap className="w-10 h-10 text-primary" />,
      title: 'Progressive Learning',
      description:
        'Advance through grade levels as you master each topic with structured lessons.',
    },
    {
      icon: <Trophy className="w-10 h-10 text-primary" />,
      title: 'Track Your Progress',
      description:
        'Complete lessons, take tests, and earn scores to prove your mastery.',
    },
    {
      icon: <Users className="w-10 h-10 text-primary" />,
      title: 'Personal Dashboard',
      description:
        'View your active enrollments, completed classes, and learning journey.',
    },
  ]

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-linear-to-br from-primary/10 via-background to-background">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Learn. Grow. <span className="text-primary">Succeed.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Your personal learning management system. Browse classes, track
            progress, and achieve your educational goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/classes">Browse Classes</Link>
            </Button>
            {!isAuthenticated && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
            )}
            {isAuthenticated && (
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">Go to Dashboard</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to learn effectively
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to start learning?</h2>
          <p className="text-muted-foreground mb-6">
            Join thousands of learners and start your educational journey today.
          </p>
          <Button size="lg" asChild>
            <Link to="/classes">Explore Classes</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
