import { getIcon } from './icons';

export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.75, ...rest }) {
  const Component = getIcon(name);
  return <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" {...rest} />;
}
