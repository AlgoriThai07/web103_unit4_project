import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CarsAPI from '../services/CarsAPI'
import CarPreview from '../components/CarPreview'
import '../App.css'

const ViewCars = ({ title }) => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)

    // Page Title
    useEffect(() => {
        document.title = title || 'BOLT BUCKET'
    }, [title])

    const fetchCars = async () => {
        try {
            const res = await CarsAPI.getAllCars()
            if (res.success) {
                setCars(res.data)
            }
        } catch (err) {
            console.error('Error fetching cars:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCars()
    }, [])

    const handleDelete = async (id, e) => {
        e.preventDefault()
        if (window.confirm('Are you sure you want to delete this custom car configuration?')) {
            try {
                const res = await CarsAPI.deleteCar(id)
                if (res.success) {
                    setCars(prev => prev.filter(car => car.id !== id))
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
                <h2>Loading your custom cars...</h2>
            </div>
        )
    }

    return (
        <main className="container" style={{ paddingTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Custom Builds</h2>
                <Link to="/" role="button" style={{ margin: 0 }}>Create New Car</Link>
            </div>

            {cars.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'var(--card-background-color)', border: '1px solid #333', borderRadius: '8px' }}>
                    <h3>No custom builds found.</h3>
                    <p style={{ color: '#aaa', marginBottom: '20px' }}>Get started by designing your first custom vehicle!</p>
                    <Link to="/" role="button">Design a Car</Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                    {cars.map((car) => (
                        <article 
                            key={car.id} 
                            style={{ 
                                margin: 0, 
                                padding: '20px', 
                                background: 'var(--card-background-color)', 
                                border: '1px solid #333', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'space-between',
                                height: '100%'
                            }}
                        >
                            <div>
                                <header style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{car.name}</h3>
                                    <span style={{ color: '#00ff88', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                        ${car.total_price.toLocaleString()}
                                    </span>
                                </header>

                                <div style={{ background: '#111', borderRadius: '6px', padding: '10px', marginBottom: '15px' }}>
                                    <CarPreview 
                                        exteriorColor={car.exterior_color}
                                        roofStyle={car.roof_color}
                                        wheelsStyle={car.wheels_color}
                                        interiorColor={car.interior_color}
                                    />
                                </div>

                                <div style={{ fontSize: '0.9rem', color: '#ccc', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                                        <span style={{ fontWeight: '600' }}>Paint:</span>
                                        <span>{car.exterior_name}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                                        <span style={{ fontWeight: '600' }}>Roof:</span>
                                        <span>{car.roof_name}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                                        <span style={{ fontWeight: '600' }}>Wheels:</span>
                                        <span>{car.wheels_name}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                                        <span style={{ fontWeight: '600' }}>Interior:</span>
                                        <span>{car.interior_name}</span>
                                    </div>
                                </div>
                            </div>

                            <footer style={{ borderTop: '1px solid #333', paddingTop: '15px', display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: 'auto' }}>
                                <Link to={`/customcars/${car.id}`} role="button" className="secondary" style={{ flex: 1, textAlign: 'center', padding: '8px 0', margin: 0, fontSize: '0.85rem' }}>
                                    Details
                                </Link>
                                <Link to={`/edit/${car.id}`} role="button" style={{ flex: 1, textAlign: 'center', padding: '8px 0', margin: 0, fontSize: '0.85rem' }}>
                                    Edit
                                </Link>
                                <button 
                                    onClick={(e) => handleDelete(car.id, e)} 
                                    className="contrast" 
                                    style={{ flex: 1, padding: '8px 0', margin: 0, fontSize: '0.85rem', background: '#d00000', color: '#fff', border: 'none' }}
                                >
                                    Delete
                                </button>
                            </footer>
                        </article>
                    ))}
                </div>
            )}
        </main>
    )
}

export default ViewCars