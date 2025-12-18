import { Link } from 'react-router-dom'

export default function Logo({ className = "", linkTo = "/dashboard" }) {
  const logoContent = (
    <>
      {/* F Arrow Icon */}
      <svg 
        width="40" 
        height="40" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* F shape with arrow - black color */}
        <path 
          d="M20 20 L20 80 L30 80 L30 55 L55 55 L55 45 L30 45 L30 30 L60 30 L60 20 L20 20 Z" 
          fill="#1F2937"
        />
        <path 
          d="M50 40 L50 60 L70 50 Z" 
          fill="#1F2937"
        />
      </svg>
      
      {/* FleetUnite Text */}
      <span className="text-2xl font-bold text-gray-900">
        FleetUnite
      </span>
    </>
  )

  // If linkTo is null, render without link (for login/signup pages)
  if (linkTo === null) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {logoContent}
      </div>
    )
  }

  return (
    <Link 
      to={linkTo} 
      className={`flex items-center gap-3 hover:opacity-80 transition ${className}`}
    >
      {logoContent}
    </Link>
  )
}
