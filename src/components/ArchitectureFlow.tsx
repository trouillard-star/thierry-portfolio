import type { Locale } from "@/src/data/profile";
import type { Project } from "@/src/data/projects";

export function ArchitectureFlow({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  const nodes = project.architecture[locale];

  return (
    <div
      className="architecture-flow"
      role="img"
      aria-label={nodes.join(locale === "fr" ? " vers " : " to ")}
    >
      {nodes.map((node, index) => (
        <div className="architecture-step" key={node}>
          <span className="architecture-number">0{index + 1}</span>
          <strong>{node}</strong>
          {index < nodes.length - 1 ? (
            <span className="architecture-connector" aria-hidden="true">
              →
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
