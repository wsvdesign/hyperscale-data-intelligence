import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', className: 'sn-home', end: true },
  { to: '/hub-map', label: 'Hub Map' },
  { to: '/hybrid-map', label: 'Hybrid Map' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/growth-pressure', label: 'Growth Pressure' },
  { to: '/data-query', label: 'Data Query' },
  { to: '/research', label: 'Research' },
];

export default function Nav() {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            `sn ${link.className ? link.className : ''} ${isActive ? 'sn-active' : ''}`.trim()
          }
        >
          <span className="sn-label">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
