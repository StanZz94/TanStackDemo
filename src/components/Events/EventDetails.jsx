import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, deleteEvent, fetchEvent } from '../../util/http.js';

export default function EventDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const id = params.id

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['event', id],
    queryFn: ({ signal }) => fetchEvent({ signal, id }),
  });

  const { mutate } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      navigate('/events');
    }
  });


  function handleDelete() {
    mutate({ id });
  }

  if (isPending) {
    return <p className="text-white text-center mt-8">Loading...</p>;
  }

  if (isError) {
    return <p className="text-red-500 text-center mt-8">Error: {error.message}</p>;
  }


  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
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
      </article>
    </>
  );
}
