import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { useNavigate, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

const SearchUser = (props) => {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div>
      <input type="text" value={value} onChange={onChange} />
      <button
        onClick={() => {
          navigate(`/${value}`);
          props.setUserName(value);
        }}
      >
        search
      </button>
    </div>
  );
};

const ReposList = (props) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.github.com/users/${props.userName}/repos`)
      .then((repo) => {
        setList(repo.data);
      });
  }, [props.userName]);

  return (
    <div>
      {list.map((el) => {
        return (
          <div key={el.id}>
            <Link to={`/${props.userName}/${el.name}`}>{el.name}</Link>
          </div>
        );
      })}
    </div>
  );
};
const Reamdme = () => {
  const [file, setFile] = useState('');
  const { userName, repositoryName } = useParams();
  useEffect(() => {
    axios
      .get(
        `https://raw.githubusercontent.com/${userName}/${repositoryName}/master/README.md`
      )
      .then((el) => {
        setFile(el.data);
      });
  }, [userName, repositoryName]);

  return (
    <div>
      <ReactMarkdown>{file}</ReactMarkdown>
    </div>
  );
};

const Header = (props) => {
  return (
    <div>
      {props.userName}
      <Link to={'/'}> Go back </Link>

      <Link to={'/:userName'}> Repository list </Link>
    </div>
  );
};

function App() {
  const [userName, setUserName] = useState('');

  return (
    <BrowserRouter>
      <Header userName={userName} />
      <Routes>
        <Route path="/" element={<SearchUser setUserName={setUserName} />} />
        <Route path="/:userName" element={<ReposList userName={userName} />} />
        <Route path="/:userName/:repositoryName" element={<Reamdme />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
