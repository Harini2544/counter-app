import React, { useEffect, useContext, useReducer, useCallback } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { ...state,count: action.count };
    case 'INCREMENT':
      return { ...state,count: state.count + 1 };
    case 'DECREMENT':
      return { ...state,count: state.count - 1 };
    case 'SET_MY_COUNT':
      return { ...state, myCount: action.myCount || 0 };
    case 'INCREMENT_MY_COUNT':
      return { ...state, myCount: state.myCount + 1 };
    case 'DECREMENT_MY_COUNT':
      return { ...state, myCount: state.myCount - 1 };
    default:
      return state;
  }
};

const Home = () => {
  const { state } = useContext(CounterContext);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <h1>My Counter Value: {state.myCount}</h1>
   {/*<Link to="/counter">Counter</Link>*/}
    </div>
  );
};

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/counter');
      dispatch({ type: 'SET', count: response.data.count });
     // dispatch({ type: 'SET_MY_COUNT', myCount: response.data.myCount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/increment');
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/decrement');
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};



const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/counter');
        console.log('Response data:', response.data); 
        dispatch({ type: 'SET_MY_COUNT', myCount: response.data.myCount });
      } catch (err) {
        console.error(err);
      // dispatch({ type: 'SET_MY_COUNT', myCount: 0 });
      }
    };

    fetchCounter();
  }, [dispatch]);

  console.log('Current state:', state);

  const incrementMyCounter = () => {
    dispatch({ type: 'INCREMENT_MY_COUNT' });
  };

  const decrementMyCounter = () => {
    dispatch({ type: 'DECREMENT_MY_COUNT' });
  };

  return (
    <div>
      <h2>My Counter</h2>
      <p>My Count: {state.myCount}</p>
     {/* <p>Count: {state.count}</p>*/}
      <button onClick={incrementMyCounter}>Increment My Count</button>
      <button onClick={decrementMyCounter}>Decrement My Count</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, myCount: 0 });

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">My Counter</Link> {/* Add link to MyCounter */}
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
