import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Api from '../../services/api';

import Container from '../../components/Container';

import { Loading, Owner, IssueList } from './styles';

export default class Repository extends Component {
  state = {
    repository: {},
    issues: [],
    loading: true,
  };

  async componentDidMount() {
    const { match } = this.props;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      Api.get(`/repos/${repoName}`),
      Api.get(`/repos/${repoName}/issues`, {
        params: {
          status: 'open',
          per_page: 5,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  render() {
    const { repository, issues, loading } = this.state;

    if (loading) {
      return <Loading>Loading</Loading>;
    }
    return (
      <Container>
        <Owner>
          <Link to="/">Return to repo list</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.owner.name}</h1>
          <p>{repository.description}</p>
        </Owner>

        <IssueList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.name} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.user.name}
                  {issue.labels.map(label => (
                    <span key={label.id}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssueList>
      </Container>
    );
  }
}
Repository.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      repository: PropTypes.string,
    }),
  }).isRequired,
};
