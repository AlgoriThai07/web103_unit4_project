import React from 'react'

const CarPreview = ({ exteriorColor = '#c0c0c0', roofStyle = 'body', wheelsStyle = 'aero', interiorColor = '#595959' }) => {
    // Helper to render wheel spokes
    const renderWheelRim = (style) => {
        if (style === 'sport') {
            return (
                <g>
                    <circle cx="0" cy="0" r="28" fill="#d0d0d0" stroke="#888" strokeWidth="2" />
                    {[0, 72, 144, 216, 288].map((deg) => (
                        <line
                            key={deg}
                            x1="0"
                            y1="0"
                            x2={28 * Math.cos((deg * Math.PI) / 180)}
                            y2={28 * Math.sin((deg * Math.PI) / 180)}
                            stroke="#555"
                            strokeWidth="5"
                        />
                    ))}
                    <circle cx="0" cy="0" r="8" fill="#666" />
                </g>
            )
        } else if (style === 'performance') {
            return (
                <g>
                    <circle cx="0" cy="0" r="28" fill="#1c1c1c" stroke="#333" strokeWidth="2" />
                    {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
                        <line
                            key={deg}
                            x1="0"
                            y1="0"
                            x2={28 * Math.cos((deg * Math.PI) / 180)}
                            y2={28 * Math.sin((deg * Math.PI) / 180)}
                            stroke="#d00000"
                            strokeWidth="2"
                        />
                    ))}
                    <circle cx="0" cy="0" r="6" fill="#000" stroke="#d00000" strokeWidth="1" />
                </g>
            )
        } else if (style === 'carbonblade') {
            return (
                <g>
                    <circle cx="0" cy="0" r="28" fill="#2d2d2d" stroke="#111" strokeWidth="2" />
                    {[0, 60, 120, 180, 240, 300].map((deg) => (
                        <path
                            key={deg}
                            d={`M 0,0 L ${28 * Math.cos((deg * Math.PI) / 180)} ${28 * Math.sin((deg * Math.PI) / 180)} L ${26 * Math.cos(((deg + 15) * Math.PI) / 180)} ${26 * Math.sin(((deg + 15) * Math.PI) / 180)} Z`}
                            fill="#5c5c5c"
                            stroke="#222"
                            strokeWidth="1"
                        />
                    ))}
                    <circle cx="0" cy="0" r="6" fill="#111" />
                </g>
            )
        } else {
            // Default: 'aero'
            return (
                <g>
                    <circle cx="0" cy="0" r="28" fill="#777" stroke="#444" strokeWidth="2" />
                    <circle cx="0" cy="0" r="14" fill="#2d2d2d" stroke="#333" strokeWidth="2" />
                    <circle cx="0" cy="0" r="6" fill="#777" />
                    <circle cx="0" cy="-18" r="3" fill="#2d2d2d" />
                    <circle cx="18" cy="0" r="3" fill="#2d2d2d" />
                    <circle cx="0" cy="18" r="3" fill="#2d2d2d" />
                    <circle cx="-18" cy="0" r="3" fill="#2d2d2d" />
                </g>
            )
        }
    }

    return (
        <svg viewBox="0 0 600 250" width="100%" height="100%" style={{ maxHeight: '300px' }} className="car-svg">
            <defs>
                <linearGradient id="glass-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#80c1ff" stopOpacity="0.7"/>
                    <stop offset="100%" stopColor="#004d99" stopOpacity="0.8"/>
                </linearGradient>
                <pattern id="carbon-pattern" width="6" height="6" patternUnits="userSpaceOnUse">
                    <rect width="6" height="6" fill="#1f1f1f" />
                    <path d="M0 3 L6 3 M3 0 L3 6" stroke="#111" strokeWidth="1" />
                    <path d="M0 0 L6 6" stroke="#333" strokeWidth="1.5" />
                </pattern>
            </defs>

            {/* Ground Shadow */}
            <ellipse cx="300" cy="205" rx="250" ry="12" fill="rgba(0, 0, 0, 0.45)" filter="blur(6px)" />

            {/* Car body */}
            <path
                d="M 60,195 
                   C 50,190 45,165 70,155 
                   C 85,150 105,145 130,125 
                   C 150,110 185,75 250,75 
                   C 320,75 420,95 470,120 
                   C 510,135 540,150 550,175 
                   C 555,185 545,195 530,195 
                   Z"
                fill={exteriorColor}
                stroke="#111"
                strokeWidth="3.5"
            />

            {/* Interior Seat Preview visible under window */}
            <rect x="235" y="110" width="35" height="35" rx="8" fill={interiorColor} stroke="#222" strokeWidth="1.5" />
            <rect x="285" y="105" width="40" height="40" rx="10" fill={interiorColor} stroke="#222" strokeWidth="1.5" />

            {/* Window Glass Overlay */}
            <path
                d="M 160,123 
                   C 180,113 210,85 250,85 
                   C 310,85 410,105 435,123 
                   Z"
                fill="url(#glass-grad)"
                stroke="#111"
                strokeWidth="2.5"
            />

            {/* Roof Section (if premium) */}
            {roofStyle === 'carbon' && (
                <path
                    d="M 175,90 C 205,80 240,75 285,75 C 330,75 375,83 400,92 L 398,99 C 373,90 330,81 285,81 C 240,81 205,86 178,96 Z"
                    fill="url(#carbon-pattern)"
                    stroke="#111"
                    strokeWidth="1.5"
                />
            )}
            {roofStyle === 'panoramic' && (
                <path
                    d="M 175,90 C 205,80 240,75 285,75 C 330,75 375,83 400,92 L 398,99 C 373,90 330,81 285,81 C 240,81 205,86 178,96 Z"
                    fill="url(#glass-grad)"
                    stroke="#111"
                    strokeWidth="1.5"
                />
            )}
            {roofStyle === 'convertible' && (
                <path
                    d="M 175,90 C 205,80 240,75 285,75 C 330,75 375,83 400,92 L 398,99 C 373,90 330,81 285,81 C 240,81 205,86 178,96 Z"
                    fill="#333333"
                    stroke="#111"
                    strokeWidth="1.5"
                />
            )}

            {/* Wheel Arch Cutouts */}
            <circle cx="150" cy="195" r="43" fill="#151515" />
            <circle cx="450" cy="195" r="43" fill="#151515" />

            {/* Wheels */}
            <g transform="translate(150, 195)">
                <circle cx="0" cy="0" r="38" fill="#1c1c1c" stroke="#111" strokeWidth="6" />
                {renderWheelRim(wheelsStyle)}
            </g>
            <g transform="translate(450, 195)">
                <circle cx="0" cy="0" r="38" fill="#1c1c1c" stroke="#111" strokeWidth="6" />
                {renderWheelRim(wheelsStyle)}
            </g>
        </svg>
    )
}

export default CarPreview
