import { Link } from 'react-router-dom'

export default function Logo({ className = "", linkTo = "/dashboard" }) {
  const logoContent = (
    <>
      {/* PNG logo - bigger size, centered */}
      <img 
        src="/logo.png" 
        alt="FleetUnite Logo" 
        className="h-14 w-auto object-contain flex-shrink-0"
        style={{
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* FleetUnite Text */}
      <span className="text-2xl font-bold text-gray-900">
        FleetUnite
      </span>
    </>
  )

  // If linkTo is null, render without link (for login/signup pages)
  if (linkTo === null) {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {logoContent}
      </div>
    )
  }

  return (
    <Link 
      to={linkTo} 
      className={`flex items-center gap-1 hover:opacity-80 transition ${className}`}
    >
      {logoContent}
    </Link>
  )
}
