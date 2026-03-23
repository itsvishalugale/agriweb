import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ links }) {
  const location = useLocation();

  return (
    <aside className="sidebar">
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          className={location.pathname === link.path ? "active" : ""}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
