import { ProjectDetail } from '@/components/project/project-detail'

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params
  // TODO: fetch real project from database by id
  return <ProjectDetail projectId={id} />
}
