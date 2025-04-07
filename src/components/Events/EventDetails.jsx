import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Modal from "../UI/Modal.jsx"
import Header from '../Header.jsx';
import { queryClient, deleteEvent, fetchEvent } from '../../util/http.js';

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const params = useParams();
  const id = params.id

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const { mutate } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none',
      });
      navigate('/events');
    }
  });

  function handleStartDeleting() {
    setIsDeleting(true);
  }

  function handleStopDeleting() {
    setIsDeleting(false);
  }

  function handleDelete() {
    mutate({ id });
  }

  let content;

  if (isPending) {
    content = (<div id='event-details-content' className='center'>
      <p>Fething event...</p>
    </div>
    )
  };

  if (isError) {
    content = (
      <ErrorBlock title="Failed to load event." message={error.info?.message || "Failed to fetch event data. Please try again later!"} />
    )
  }

  if (data) {
    content = (
      <>
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDeleting}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
          <img src={`http://localhost:3000/${data.image}`} alt="image" />
          <div id="event-details-info">
            <div>
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`Todo-DateT$Todo-Time`}>{data.date + ' at ' + data.time}</time>
            </div>
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {isDeleting && (<Modal onClose={handleStopDeleting}>
        <h2>Are you sure?</h2>
        <p>This action cannot be undone!</p>
        <div className='form-actions'>
          <button onClick={handleStopDeleting} className='button-text'>Cancel</button>
          <button onClick={handleDelete} className='button'>Delete</button>
        </div>
      </Modal>)}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}
