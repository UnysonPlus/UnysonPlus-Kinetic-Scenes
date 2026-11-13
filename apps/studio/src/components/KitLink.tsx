import { Fragment, type ReactNode } from 'react';
import { KIT_REPO } from './GetKit';

/**
 * "AI Dev Kit" as a link to its GitHub page. Every mention of the kit in the Studio links there, so a person who
 * reads that something needs it can get it in one click.
 */
export function KitLink(props: { children?: ReactNode }) {
  return (
    <a className="kit-link" href={KIT_REPO} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
      {props.children ?? 'AI Dev Kit'}
    </a>
  );
}

const PHRASE = /AI Dev Kit/g;

/**
 * A message with every "AI Dev Kit" in it linked (errors, notices and hints written as plain strings). Anything that
 * is not a string, or a string without the name, comes back unchanged, so any value can be passed through.
 */
export function kitify<T>(value: T): T | ReactNode {
  if (typeof value !== 'string' || !value.includes('AI Dev Kit')) return value;
  const parts = value.split(PHRASE);
  return parts.map((part, i) => (
    <Fragment key={i}>{part}{i < parts.length - 1 && <KitLink />}</Fragment>
  ));
}
