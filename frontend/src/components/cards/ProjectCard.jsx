import { Link } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import ProjectVisual from '@/components/ui/ProjectVisual';
import { SampleChip } from '@/components/ui/SampleNotice';
import useTilt from '@/hooks/useTilt';

export default function ProjectCard({ project }) {
  const { ref, tiltProps } = useTilt({ max: 6 });

  return (
    <article
      ref={ref}
      {...tiltProps}
      className="tilt-3d group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-surface/70 hover:border-brand/40 hover:shadow-lift"
    >
      <div className="relative overflow-hidden">
        <ProjectVisual
          visual={project.visual}
          image={project.cover}
          alt={project.title}
          label={project.categoryName}
          className="transition-transform duration-700 group-hover:scale-[1.04]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface/90 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-black/55 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur">
            {project.categoryName}
          </span>
          {project.isSample && <SampleChip className="bg-black/55 backdrop-blur" />}
        </div>
      </div>

      <div className="tilt-layer relative flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-wider text-faint">
          <span>{project.year}</span>
          <span className="h-1 w-1 rounded-full bg-faint" />
          <span className="flex items-center gap-1 text-emerald-500">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            {project.status}
          </span>
        </div>

        <h3 className="mt-2 text-[1.08rem] font-bold leading-snug text-ink transition-colors group-hover:text-brand">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.86rem] leading-relaxed text-muted">{project.short}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="rounded-md bg-elevated px-2 py-1 text-[0.68rem] font-medium text-muted">
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-5">
          <Link
            to={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-brand transition-colors hover:text-accent"
          >
            Read the case study
            <Icon name="ArrowRight" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 text-muted transition-colors hover:text-ink"
              aria-label={`Open ${project.title} live site`}
            >
              <Icon name="ExternalLink" className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>

      <Link to={`/portfolio/${project.slug}`} className="absolute inset-0" tabIndex={-1} aria-hidden="true" />
    </article>
  );
}
