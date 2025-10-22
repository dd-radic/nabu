// import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from 'react'; //Need this for the useState() method

/**TODO: DELETE BEFORE RELEASING TO PRODUCTION */


/**
 * Note: Anything in React that starts with 'use' is called a hook, a special function that lets you
 * use React's special features. There are many types of hooks
 * 
 * Examples:
 * useState - for managing state
 * useEffect - for handling side effects like data fetching
 * useContext - for sharing data across components
 * useCallback - for optimizing callback functions
 * And more!
 * 
 * */

const Card = ({title}) =>{ //Example of accepting a prop in an object
  //Example of inline styling
  //NOTE: inline styles have preference over other CSS styling
  // <div style={{
  //   border: '1px solid #4b5362',
  //   padding: '20px',
  //   backgroundColor: '#31363f',
  //   borderRadius: '10px',
  //   minHeight: '100px',
  // }}>

  //Example of a React State
  //In the array, first give the variable name, then set and use the same variable name
  /**
   * NOTE: What component the state function is declared in matters. If the state is global to the whole app,
   * it should be declared in the App component. If it is specific to each card (like it is here), then it should
   * be declared in the Card component
   */
  //NOTE: THE STATE IS NOT CONSISTENT ACROSS BROWSER RELOADS, IT WILL RESET TO DEFAULT
  const [hasLiked, setHasLiked] = useState(false); 

  const[count, setCount] = useState(0);

  /**
   * NOTE: When Strict Mode (development mode) is on, useEffect will always trigger twice. This is because
   * React runs setup and cleanup one extra time before the actual setup to stress-test that Effect logic
   * is implemented correctly.
   */
  useEffect( () => {
    console.log(`${title} has been liked: ${hasLiked}`);
  }, [hasLiked]);
  /**
   * Here, hasLiked is working as a dependency parameter. React will check if any changes have been made
   * to this array, and will only call useEffect() if a change has been made
   */

  /**
   * NOTE: This useEffect will only fire when the component is 'mounted' (first created)
   */
  useEffect(()=>{
    console.log('Card Rendered.');
  }, []);

  /**
   * Here, we have given count "conditional rendering". The logic for this is better represented as the following
   * ternary: count ? count : null which will check if count exists, and if so, count will be rendered, otherwise
   * null (nothing) will be rendered
   */
  <div className="card" onClick={() => setCount((prevState) => prevState + 1)}>
    <h2>{title}<br></br>{count  || null}</h2>

    <button onClick={() => setHasLiked(!hasLiked)}>
      {hasLiked ? 'Liked' : 'Like'}
    </button>
  </div>
}

//Example API setup (our API_OPTIONS will likely be different)
const API_BASE_URL = '';
const API_KEY = import.meta.env.API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

const App = () => {
  const [movieList, setMovieList] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //Example of an API call from the client side
  const fetchMovies = async () =>{
    setIsLoading(true);
    try{
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok){
        throw new Error('Failed to fetch movies.');
      }

      const data = await response.json(); //Parses the response
      console.log(data);

      if(data.Response === 'False'){
        console.error(data.Error || 'Failed to fetch movies.');
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);

    } catch (error){
      console.error(`Error fetching movies: ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  //Example using useEffect to fetch data from an API
  useEffect( () => {
    fetchMovies();
  }, []);

  //The return statement is where you put the HTML components you want rendered to the screen
  return(
    <div className="card-container">
      <h2>Functional Arrow Component</h2>
      Example of passing props into objects
      <card title="Star Wars" rating={5} isCool={true} actors={[{name: 'Actors'}]}></card>
      <card title="Avatar"></card>
    </div>
  )
}

export default App;



// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
