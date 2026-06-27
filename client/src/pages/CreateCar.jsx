import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CarsAPI from '../services/CarsAPI'
import CarPreview from '../components/CarPreview'
import { basePrice, calculateTotalPrice, getOptionPriceString } from '../utilities/calcprice'
import { checkIncompatibility, isCombinationInvalid } from '../utilities/validation'
import '../App.css'

const CreateCar = ({ title }) => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [options, setOptions] = useState([])
    const [incompatibilities, setIncompatibilities] = useState([])
    const [loading, setLoading] = useState(true)

    // Selection States
    const [selectedExterior, setSelectedExterior] = useState(null)
    const [selectedRoof, setSelectedRoof] = useState(null)
    const [selectedWheels, setSelectedWheels] = useState(null)
    const [selectedInterior, setSelectedInterior] = useState(null)

    // Page Title
    useEffect(() => {
        document.title = title || 'BOLT BUCKET'
    }, [title])

    // Fetch Options & Incompatibilities
    useEffect(() => {
        const fetchData = async () => {
            try {
                const optRes = await CarsAPI.getAllOptions()
                const incRes = await CarsAPI.getIncompatibilities()

                if (optRes.success && incRes.success) {
                    const opts = optRes.data
                    setOptions(opts)
                    setIncompatibilities(incRes.data)

                    // Set default options
                    setSelectedExterior(opts.find(o => o.category === 'exterior' && o.is_default))
                    setSelectedRoof(opts.find(o => o.category === 'roof' && o.is_default))
                    setSelectedWheels(opts.find(o => o.category === 'wheels' && o.is_default))
                    setSelectedInterior(opts.find(o => o.category === 'interior' && o.is_default))
                }
            } catch (err) {
                console.error('Error loading builder data:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>Loading options...</h2>
            </div>
        )
    }

    const totalPrice = calculateTotalPrice(selectedExterior, selectedRoof, selectedWheels, selectedInterior)

    // Helper: Wrapper for checking incompatibility using the imported utility function
    const getIncompatibilityReason = (option) => {
        return checkIncompatibility(option, selectedExterior, selectedRoof, selectedWheels, selectedInterior, incompatibilities)
    }

    const handleSelectOption = (option) => {
        const incompatibilityReason = getIncompatibilityReason(option)
        if (incompatibilityReason) {
            alert(`Impossible combination! ${incompatibilityReason}`)
            return
        }

        if (option.category === 'exterior') setSelectedExterior(option)
        else if (option.category === 'roof') setSelectedRoof(option)
        else if (option.category === 'wheels') setSelectedWheels(option)
        else if (option.category === 'interior') setSelectedInterior(option)
    }

    const handleCreateCar = async (e) => {
        e.preventDefault()

        if (!name.trim()) {
            alert('Please give your custom car a name!')
            return
        }

        // Final double check on incompatibilities
        const invalidReason = isCombinationInvalid(selectedExterior, selectedRoof, selectedWheels, selectedInterior, incompatibilities)
        if (invalidReason) {
            alert(`Cannot save! Impossible combination: ${invalidReason}`)
            return
        }

        try {
            const carData = {
                name,
                exterior_id: selectedExterior.id,
                roof_id: selectedRoof.id,
                wheels_id: selectedWheels.id,
                interior_id: selectedInterior.id,
                total_price: totalPrice
            }

            const response = await CarsAPI.createCar(carData)
            if (response.success) {
                navigate('/customcars')
            } else {
                alert(`Error creating car: ${response.error}`)
            }
        } catch (err) {
            console.error(err)
            alert('An error occurred while saving the car.')
        }
    }

    const exteriors = options.filter(o => o.category === 'exterior')
    const roofs = options.filter(o => o.category === 'roof')
    const wheels = options.filter(o => o.category === 'wheels')
    const interiors = options.filter(o => o.category === 'interior')

    return (
        <main className="container">
            <form onSubmit={handleCreateCar} style={{ width: '100%' }}>
                <div className="grid">
                    
                    {/* Left Column - Preview and Save */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <article style={{ margin: 0, padding: '20px', background: 'var(--card-background-color)', border: '1px solid #333' }}>
                            <header style={{ marginBottom: '15px' }}>
                                <h3 style={{ textTransform: 'uppercase', letterSpacing: '1px' }}>Custom Car Preview</h3>
                            </header>
                            
                            <CarPreview 
                                exteriorColor={selectedExterior?.visual_value}
                                roofStyle={selectedRoof?.visual_value}
                                wheelsStyle={selectedWheels?.visual_value}
                                interiorColor={selectedInterior?.visual_value}
                            />

                            <div style={{ marginTop: '20px' }}>
                                <label htmlFor="car-name" style={{ fontWeight: 'bold' }}>Car Custom Build Name</label>
                                <input 
                                    type="text" 
                                    id="car-name" 
                                    placeholder="My Custom Roadster..." 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    style={{ marginTop: '5px' }}
                                />
                            </div>

                            <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', marginBottom: '5px' }}>
                                    <span>Base Model Price:</span>
                                    <span>${basePrice.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#aaa', paddingLeft: '10px' }}>
                                    <span>Paint (+{selectedExterior?.name}):</span>
                                    <span>{getOptionPriceString(selectedExterior)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#aaa', paddingLeft: '10px' }}>
                                    <span>Roof (+{selectedRoof?.name}):</span>
                                    <span>{getOptionPriceString(selectedRoof)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#aaa', paddingLeft: '10px' }}>
                                    <span>Wheels (+{selectedWheels?.name}):</span>
                                    <span>{getOptionPriceString(selectedWheels)}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#aaa', paddingLeft: '10px', paddingBottom: '10px' }}>
                                    <span>Interior (+{selectedInterior?.name}):</span>
                                    <span>{getOptionPriceString(selectedInterior)}</span>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.6rem', fontWeight: 'bold', borderTop: '1px solid #444', paddingTop: '15px' }}>
                                    <span>Total Price:</span>
                                    <span style={{ color: '#00ff88' }}>${totalPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            <footer>
                                <button type="submit" style={{ width: '100%', margin: '15px 0 0 0', background: 'var(--primary)', color: 'white' }}>
                                    Save Custom Car
                                </button>
                            </footer>
                        </article>
                    </div>

                    {/* Right Column - Customization Options */}
                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        {/* 1. Paint Color Selection */}
                        <article style={{ margin: 0, padding: '20px', background: 'var(--card-background-color)', border: '1px solid #333' }}>
                            <header style={{ marginBottom: '15px' }}>
                                <h3>1. Exterior Paint</h3>
                            </header>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {exteriors.map(opt => {
                                    const isSelected = selectedExterior?.id === opt.id
                                    const incReason = getIncompatibilityReason(opt)
                                    return (
                                        <div 
                                            key={opt.id}
                                            onClick={() => !incReason && handleSelectOption(opt)}
                                            style={{
                                                flex: '1 1 120px',
                                                padding: '12px',
                                                border: isSelected ? '2px solid #00ff88' : '1px solid #444',
                                                borderRadius: '8px',
                                                cursor: incReason ? 'not-allowed' : 'pointer',
                                                background: isSelected ? 'rgba(0, 255, 136, 0.05)' : '#111',
                                                opacity: incReason ? 0.35 : 1,
                                                textAlign: 'center',
                                                position: 'relative',
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                            title={incReason || opt.name}
                                        >
                                            <div style={{ 
                                                width: '24px', 
                                                height: '24px', 
                                                borderRadius: '50%', 
                                                backgroundColor: opt.visual_value, 
                                                margin: '0 auto 8px auto', 
                                                border: '1px solid #fff' 
                                            }} />
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{opt.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                {getOptionPriceString(opt)}
                                            </div>
                                            {incReason && (
                                                <div style={{ fontSize: '0.65rem', color: '#ff4d4d', marginTop: '4px', fontWeight: 'bold' }}>
                                                    Blocked
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </article>

                        {/* 2. Roof Selection */}
                        <article style={{ margin: 0, padding: '20px', background: 'var(--card-background-color)', border: '1px solid #333' }}>
                            <header style={{ marginBottom: '15px' }}>
                                <h3>2. Roof Style</h3>
                            </header>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {roofs.map(opt => {
                                    const isSelected = selectedRoof?.id === opt.id
                                    const incReason = getIncompatibilityReason(opt)
                                    return (
                                        <div 
                                            key={opt.id}
                                            onClick={() => !incReason && handleSelectOption(opt)}
                                            style={{
                                                flex: '1 1 120px',
                                                padding: '12px',
                                                border: isSelected ? '2px solid #00ff88' : '1px solid #444',
                                                borderRadius: '8px',
                                                cursor: incReason ? 'not-allowed' : 'pointer',
                                                background: isSelected ? 'rgba(0, 255, 136, 0.05)' : '#111',
                                                opacity: incReason ? 0.35 : 1,
                                                textAlign: 'center',
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                            title={incReason || opt.name}
                                        >
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{opt.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                                                {getOptionPriceString(opt)}
                                            </div>
                                            {incReason && (
                                                <div style={{ fontSize: '0.65rem', color: '#ff4d4d', marginTop: '4px', fontWeight: 'bold' }}>
                                                    Blocked
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </article>

                        {/* 3. Wheels Selection */}
                        <article style={{ margin: 0, padding: '20px', background: 'var(--card-background-color)', border: '1px solid #333' }}>
                            <header style={{ marginBottom: '15px' }}>
                                <h3>3. Wheels</h3>
                            </header>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {wheels.map(opt => {
                                    const isSelected = selectedWheels?.id === opt.id
                                    const incReason = getIncompatibilityReason(opt)
                                    return (
                                        <div 
                                            key={opt.id}
                                            onClick={() => !incReason && handleSelectOption(opt)}
                                            style={{
                                                flex: '1 1 120px',
                                                padding: '12px',
                                                border: isSelected ? '2px solid #00ff88' : '1px solid #444',
                                                borderRadius: '8px',
                                                cursor: incReason ? 'not-allowed' : 'pointer',
                                                background: isSelected ? 'rgba(0, 255, 136, 0.05)' : '#111',
                                                opacity: incReason ? 0.35 : 1,
                                                textAlign: 'center',
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                            title={incReason || opt.name}
                                        >
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{opt.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>
                                                {getOptionPriceString(opt)}
                                            </div>
                                            {incReason && (
                                                <div style={{ fontSize: '0.65rem', color: '#ff4d4d', marginTop: '4px', fontWeight: 'bold' }}>
                                                    Blocked
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </article>

                        {/* 4. Interior Selection */}
                        <article style={{ margin: 0, padding: '20px', background: 'var(--card-background-color)', border: '1px solid #333' }}>
                            <header style={{ marginBottom: '15px' }}>
                                <h3>4. Interior Design</h3>
                            </header>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                {interiors.map(opt => {
                                    const isSelected = selectedInterior?.id === opt.id
                                    const incReason = getIncompatibilityReason(opt)
                                    return (
                                        <div 
                                            key={opt.id}
                                            onClick={() => !incReason && handleSelectOption(opt)}
                                            style={{
                                                flex: '1 1 120px',
                                                padding: '12px',
                                                border: isSelected ? '2px solid #00ff88' : '1px solid #444',
                                                borderRadius: '8px',
                                                cursor: incReason ? 'not-allowed' : 'pointer',
                                                background: isSelected ? 'rgba(0, 255, 136, 0.05)' : '#111',
                                                opacity: incReason ? 0.35 : 1,
                                                textAlign: 'center',
                                                transition: 'all 0.2s ease-in-out'
                                            }}
                                            title={incReason || opt.name}
                                        >
                                            <div style={{ 
                                                width: '24px', 
                                                height: '24px', 
                                                borderRadius: '50%', 
                                                backgroundColor: opt.visual_value, 
                                                margin: '0 auto 8px auto', 
                                                border: '1px solid #fff' 
                                            }} />
                                            <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{opt.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#888' }}>
                                                {getOptionPriceString(opt)}
                                            </div>
                                            {incReason && (
                                                <div style={{ fontSize: '0.65rem', color: '#ff4d4d', marginTop: '4px', fontWeight: 'bold' }}>
                                                    Blocked
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </article>

                    </div>
                </div>
            </form>
        </main>
    )
}

export default CreateCar