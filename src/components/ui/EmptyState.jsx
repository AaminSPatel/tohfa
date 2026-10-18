import Button from "./Button";

/** Friendly empty / error state: says what happened and what to do next. */
export default function EmptyState({ title, text, action, secondary, icon }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
      {icon && <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-blush text-rani">{icon}</div>}
      <h2 className="text-display-md">{title}</h2>
      {text && <p className="mt-3 text-ink-soft">{text}</p>}
      {(action || secondary) && (
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          {action && <Button {...action.props} href={action.href} onClick={action.onClick}>{action.label}</Button>}
          {secondary && <Button variant="outline" href={secondary.href} onClick={secondary.onClick} external={secondary.external}>{secondary.label}</Button>}
        </div>
      )}
    </div>
  );
}
