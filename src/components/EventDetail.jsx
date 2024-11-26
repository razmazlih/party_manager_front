import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    fetchEventDetail,
    createReservation,
    fetchComments,
    createComment,
    deleteComment,
} from '../services/api';
import EventHeader from './EventDetail/EventHeader';
import EventInfo from './EventDetail/EventInfo';
import ReservationForm from './EventDetail/ReservationForm';
import CommentsSection from './EventDetail/CommentsSection';
import AddCommentForm from './EventDetail/AddCommentForm';
import './styles/EventDetail.css';

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [comments, setComments] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchEventDetail(id).then((response) => setEvent(response.data));
        fetchComments(id).then((response) => setComments(response.data));
    }, [id]);

    const handleReservation = (seats) => {
        if (!userId) {
            alert('Please log in to make a reservation.');
            return;
        }

        const reservationData = {
            user: userId,
            event: event.id,
            seats_reserved: seats,
        };

        createReservation(reservationData)
            .then((response) => navigate(`/reservations/${response.data.id}`))
            .catch((error) => {
                console.error('Error creating reservation:', error);
                alert('Failed to create reservation. Please check the input.');
            });
    };

    const handleAddComment = (text) => {
        const commentData = { event: id, content: text, user: userId };

        createComment(commentData)
            .then(() => {
                alert('Comment added successfully!');
                fetchComments(id).then((response) =>
                    setComments(response.data)
                );
            })
            .catch((error) => {
                console.error('Error adding comment:', error);
                alert('Failed to add comment.');
            });
    };

    const handleDeleteComment = (commentId) => {
        deleteComment(commentId)
            .then(() => {
                alert('Comment deleted successfully!');
                fetchComments(id).then((response) =>
                    setComments(response.data)
                );
            })
            .catch((error) => {
                console.error('Error deleting comment:', error);
                alert('Failed to delete comment.');
            });
    };

    if (!event) return <div>Loading...</div>;

    const eventDateLocal = new Date(event.date).toLocaleString();

    return (
        <div>
            <EventHeader
                name={event.name}
                date={eventDateLocal}
                description={event.description}
            />
            <EventInfo
                location={event.location}
                price={event.price}
                availablePlaces={event.available_places}
            />
            <ReservationForm
                availablePlaces={event.available_places}
                onReserve={handleReservation}
            />
            <CommentsSection
                comments={comments}
                userId={userId}
                onDelete={handleDeleteComment}
            />
            {userId &&
                !comments.some(
                    (comment) => comment.user === parseInt(userId)
                ) && <AddCommentForm onAdd={handleAddComment} />}
        </div>
    );
};

export default EventDetail;
