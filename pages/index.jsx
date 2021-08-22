import React from 'react';
import Link from 'next/link';
// import { getActiveUserName } from '../helpers/index';
// import './Home.css';

const Home = () => {
  // const activeUserName = getActiveUserName();

  // if (activeUserName) {
  //   return null;
  // }

  return (
    <div className="home">
      <Link href="/login" className="home-link">
        Log In
      </Link>
      <Link href="/signup" className="home-link">
        New User?
      </Link>
    </div>
  );
};

export default Home;
