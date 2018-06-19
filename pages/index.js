import Header from '../components/Header'
import Layout from '../components/MyLayout'
// This is the Link API
import Link from 'next/link'
import "../styles.scss"

import React from 'react';
import ReactDOM from 'react-dom';

const PostLink = ( props ) => (
  <li>
    <Link as={`/p/${props.id}`} href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
)

export default () => (
  <div>
    <h1 className="aaaa">My Blog</h1>
    <Layout>
       <ul>
         <PostLink id="hello-nextjs" title="Hello Next.js"/>
         <PostLink id="learn-nextjs" title="Learn Next.js is awesome"/>
         <PostLink id="deploy-nextjs" title="Deploy apps with Zeit"/>
       </ul>
    </Layout>
  </div>
)
