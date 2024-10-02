import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EventList from './components/EventList';
import EventDetail from './components/EventDetail';
import Login from './components/Login';
import Register from './components/Register';
import ReservationList from './components/ReservationList';
import ReservationDetail from './components/ReservationDetail'; // ייבוא של קומפוננטת ReservationDetail
import OrganizerDashboard from './components/OrganizerDashboard';
import NotificationList from './components/NotificationList';

function App() {
    const userId = localStorage.getItem('userId');

    return (
        <Router>
            <div>
                <Navbar />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<EventList />} />
                        <Route path="/events/:id" element={<EventDetail />} />
                        <Route 
                            path="/login" 
                            element={!userId ? <Login /> : <Navigate to="/" />} 
                        />
                        <Route 
                            path="/register" 
                            element={!userId ? <Register /> : <Navigate to="/" />} 
                        />
                        <Route path="/my-reservations" element={<ReservationList />} />
                        <Route path="/reservations/:reservationId" element={<ReservationDetail />} /> {/* הוספת המסלול לפרטי הזמנה */}
                        <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
                        <Route path="/notifications" element={<NotificationList />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;