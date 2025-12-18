import { Link } from 'react-router-dom'

export default function Logo({ className = "", linkTo = "/dashboard" }) {
  const logoContent = (
    <>
      {/* Logo Image - Use exact design from image, color changed to black */}
      <img 
        src="/logo.svg" 
        alt="FleetUnite Logo" 
        width="40" 
        height="40" 
        className="flex-shrink-0"
        style={{ filter: 'brightness(0)' }} // Convert to black
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
