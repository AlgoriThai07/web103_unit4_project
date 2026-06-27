import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import CarsAPI from '../services/CarsAPI'
import CarPreview from '../components/CarPreview'
import '../App.css'

const CarDetails = ({ title }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [car, setCar] = useState(null)
    const [loading, setLoading] = useState(true)

    // Page Title
    useEffect(() => {
        document.title = title || 'BOLT BUCKET'
    }, [title])

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await CarsAPI.getCarById(id)
                if (res.success) {
                    setCar(res.data)
                }
            } catch (err) {
                console.error('Error fetching car:', err)
            } finally {
                setLoading(false)
            }
        }
        fetchCar()
    }, [id])

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${car.name}"?`)) {
            try {
                const res = await CarsAPI.deleteCar(id)
                if (res.success) {
                    navigate('/customcars')
                } else {
                    alert(`Error deleting: ${res.error}`)
                }
            } catch (err) {
                console.error(err)
                alert('Failed to delete the car.')
            }
        }
    }

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>Loading car details...</h2>
            </div>
        )
    }

    if (!car) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
                <h2>Car configuration not found.</h2>
                <Link to="/customcars" role="button">Back to Custom Cars</Link>
            </div>
        )
    }

    const basePrice = 45000

    return (
        <main className="container" style={{ paddingTop: '20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                
                <div style={{ marginBottom: '20px' }}>
                    <Link to="/customcars" style={{ textDecoration: 'none', color: '#aaa' }}>
                        ← Back to Custom Cars
                    </Link>
                </div>

                <article style={{ padding: '30px', background: 'var(--card-background-color)', border: '1px solid #333' }}>
                    <header style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>{car.name}</h2>
                        <span style={{ fontSize: '1.8rem', color: '#00ff88', fontWeight: 'bold' }}>
                            ${car.total_price.toLocaleString()}
                        </span>
                    </header>

                    <div style={{ background: '#111', borderRadius: '8px', padding: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
                        <CarPreview 
                            exteriorColor={car.exterior_color}
                            roofStyle={car.roof_color}
                            wheelsStyle={car.wheels_color}
                            interiorColor={car.interior_color}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h3>Configuration Summary</h3>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '15px' }}>
                            <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                <div style={{ fontWeight: 'bold', color: '#aaa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Exterior Paint</div>
                                <div style={{ fontSize: '1.1rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: car.exterior_color, border: '1px solid #fff' }} />
                                    {car.exterior_name}
                                </div>
                                <div style={{ color: '#888', fontSize: '0.9rem', marginTop: '2px' }}>
                                    {car.exterior_price === 0 ? 'Included' : `+$${car.exterior_price.toLocaleString()}`}
                                </div>
                            </div>

                            <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                <div style={{ fontWeight: 'bold', color: '#aaa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Roof Style</div>
                                <div style={{ fontSize: '1.1rem', marginTop: '5px' }}>{car.roof_name}</div>
                                <div style={{ color: '#888', fontSize: '0.9rem', marginTop: '2px' }}>
                                    {car.roof_price === 0 ? 'Included' : `+$${car.roof_price.toLocaleString()}`}
                                </div>
                            </div>

                            <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                <div style={{ fontWeight: 'bold', color: '#aaa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Wheels</div>
                                <div style={{ fontSize: '1.1rem', marginTop: '5px' }}>{car.wheels_name}</div>
                                <div style={{ color: '#888', fontSize: '0.9rem', marginTop: '2px' }}>
                                    {car.wheels_price === 0 ? 'Included' : `+$${car.wheels_price.toLocaleString()}`}
                                </div>
                            </div>

                            <div style={{ borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                                <div style={{ fontWeight: 'bold', color: '#aaa', fontSize: '0.85rem', textTransform: 'uppercase' }}>Interior Design</div>
                                <div style={{ fontSize: '1.1rem', marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: car.interior_color, border: '1px solid #fff' }} />
                                    {car.interior_name}
                                </div>
                                <div style={{ color: '#888', fontSize: '0.9rem', marginTop: '2px' }}>
                                    {car.interior_price === 0 ? 'Included' : `+$${car.interior_price.toLocaleString()}`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #333', paddingTop: '20px', marginBottom: '30px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span>Base Car Price:</span>
                            <span>${basePrice.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#aaa' }}>
                            <span>Selected Options:</span>
                            <span>
                                +${(car.total_price - basePrice).toLocaleString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.4rem', fontWeight: 'bold', borderTop: '1px dashed #444', paddingTop: '10px', marginTop: '10px' }}>
                            <span>Total Build Price:</span>
                            <span style={{ color: '#00ff88' }}>${car.total_price.toLocaleString()}</span>
                        </div>
                    </div>

                    <footer style={{ borderTop: '1px solid #333', paddingTop: '20px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                        <Link to={`/edit/${car.id}`} role="button" style={{ margin: 0, padding: '10px 30px' }}>
                            Edit Build
                        </Link>
                        <button 
                            onClick={handleDelete} 
                            className="contrast" 
                            style={{ margin: 0, padding: '10px 30px', background: '#d00000', color: '#fff', border: 'none' }}
                        >
                            Delete Build
                        </button>
                    </footer>
                </article>
            </div>
        </main>
    )
}

export default CarDetails