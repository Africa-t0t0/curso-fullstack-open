import { useDispatch, useSelector } from 'react-redux';
import { Routes, Route, Link, useMatch } from 'react-router-dom';
import { setTimedNotification } from './store/notificationSlice';
import { createBlog, initializeBlogs, likeBlog, deleteBlog } from './store/blogSlice';
import { useEffect } from 'react';
import Notification from './components/Notification';

const Menu = () => {
  const padding = {
    paddingRight: 5
  };
  return (
    <div>
      <Link to="/" style={padding}>anecdotes</Link>
      <Link to="/create" style={padding}>create new</Link>
      <Link to="/about" style={padding}>about</Link>
    </div>
  );
};

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <li key={anecdote.id}>
          <Link to={`/anecdotes/${anecdote.id}`}>
            {anecdote.content}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Anecdote = ({ anecdote }) => {
  if (!anecdote) return null;
  
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <div>has {anecdote.votes} votes</div>
      <div>for more info see <a href={anecdote.info}>{anecdote.info}</a></div>
    </div>
  );
};

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    <em>An anecdote is a brief, revealing account of an individual person or an incident.</em>
    <p>Software engineering is full of excellent anecdotes.</p>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.
  </div>
);

const CreateNew = () => {
  const dispatch = useDispatch();
  
  const addNew = async (anecdote) => {
    try {
      await dispatch(createBlog(anecdote));
      dispatch(setTimedNotification(`A new anecdote "${anecdote.content}" created!`, 'success'));
    } catch (error) {
      dispatch(setTimedNotification('Error creating anecdote', 'error'));
    }
  };

  return <CreateNewForm addNew={addNew} />;
};

const CreateNewForm = ({ addNew }) => {
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [info, setInfo] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content,
      author,
      info,
      votes: 0
    });
    navigate('/');
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <div>
          author
          <input name='author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
          url for more info
          <input name='info' value={info} onChange={(e) => setInfo(e.target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const anecdotes = useSelector(state => state.blogs);
  const [filter, setFilter] = useState('');
  
  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  const match = useMatch('/anecdotes/:id');
  const anecdote = match 
    ? anecdotes.find(anecdote => anecdote.id === match.params.id)
    : null;

  const vote = (id) => {
    const anecdote = anecdotes.find(a => a.id === id);
    const votedAnecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    };
    dispatch(likeBlog(votedAnecdote));
    dispatch(setTimedNotification(`You voted for "${anecdote.content}"`, 'success'));
  };

  const handleDelete = (id) => {
    const anecdote = anecdotes.find(a => a.id === id);
    if (window.confirm(`Delete anecdote "${anecdote.content}"?`)) {
      dispatch(deleteBlog(id));
      dispatch(setTimedNotification('Anecdote deleted', 'success'));
    }
  };

  const filteredAnecdotes = anecdotes.filter(anecdote =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      <Notification />
      
      <Routes>
        <Route path="/" element={
          <div>
            <div>
              filter <input value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <AnecdoteList anecdotes={filteredAnecdotes} />
          </div>
        } />
        
        <Route path="/anecdotes/:id" element={
          <Anecdote anecdote={anecdote} />
        } />
        
        <Route path="/create" element={
          <CreateNew />
        } />
        
        <Route path="/about" element={
          <About />
        } />
      </Routes>
      
      <Footer />
    </div>
  );
};

export default App;
