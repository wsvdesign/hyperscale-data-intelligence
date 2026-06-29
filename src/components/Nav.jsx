import { NavLink } from 'react-router-dom';

const NAV_LINK_STYLE = {
  fontSize: '12px',
  padding: '5px 12px',
};

const links = [
  { to: '/', icon: '⌂', label: 'Home', className: 'sn-home', end: true },
  { to: '/hub-map', icon: '①', label: 'Hub Map' },
  { to: '/hybrid-map', icon: '②', label: 'Hybrid Map' },
  { to: '/timeline', icon: '③', label: 'Timeline' },
  { to: '/growth-pressure', icon: '④', label: 'Growth Pressure' },
  { to: '/data-query', icon: '⑤', label: 'Data Query' },
  { to: '/research', label: 'Research', icon: '⑥', cls: '' },
];

export default function Nav() {
  return (
    <nav className="site-nav" aria-label="Primary navigation">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          style={NAV_LINK_STYLE}
          className={({ isActive }) =>
            `sn ${link.className ? link.className : ''} ${isActive ? 'sn-active' : ''}`.trim()
          }
        >
          <span>{link.icon}</span> <span className="sn-label">{link.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
