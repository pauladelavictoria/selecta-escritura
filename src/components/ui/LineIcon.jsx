// Iconos de línea (trazo) para ilustraciones grandes. Los pequeños de interfaz están en Icon.jsx.
const icons = {
  gift: (
    <>
      <rect x="3.5" y="8" width="17" height="4" rx="1" />
      <path d="M5 12v7.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V12" />
      <path d="M12 8v12.5" />
      <path d="M12 8C10.8 5.2 7.5 3.6 6.8 5.6 6.2 7.3 9.2 8 12 8Zm0 0c1.2-2.8 4.5-4.4 5.2-2.4.6 1.7-2.4 2.4-5.2 2.4Z" />
    </>
  ),
  heart: (
    <path d="M12 19.5s-7.5-4.6-7.5-10A4 4 0 0 1 12 7.2a4 4 0 0 1 7.5 2.3c0 5.4-7.5 10-7.5 10Z" />
  ),
  book: (
    <>
      <path d="M12 6.5C10 5 7 4.4 3.5 4.9v13.2c3.5-.5 6.5.1 8.5 1.6 2-1.5 5-2.1 8.5-1.6V4.9C17 4.4 14 5 12 6.5Z" />
      <path d="M12 6.5v13.2" />
    </>
  ),
  member: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <circle cx="8.5" cy="10.5" r="2.2" />
      <path d="M5.2 16c.6-1.8 1.8-2.8 3.3-2.8s2.7 1 3.3 2.8" />
      <path d="M14.5 10h4.5M14.5 13h3" />
    </>
  ),
}

export default function LineIcon({ name, size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}
