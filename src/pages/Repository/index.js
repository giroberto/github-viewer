import React from 'react';

export default function Repository({ match }) {
  return <div>Repo {decodeURIComponent(match.params.repository)}</div>;
}
