import './style.css';

function SearchBox(props) {

  return (
    <div className="searchbox">
      <input type="text" />
      <button onClick={props.handleSubmit}>Submit</button>
    </div>
  );
}

export default SearchBox;