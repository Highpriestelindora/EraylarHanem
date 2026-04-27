import { createPortal } from 'react-dom';

export default function Portal({ children }) {
  // Render children into the #root-portal element if it exists, 
  // otherwise fallback to document.body
  const mount = document.getElementById('root-portal') || document.body;
  return createPortal(children, mount);
}
