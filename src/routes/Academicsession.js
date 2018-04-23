import React from 'react';
import moment from 'moment'
import {connect} from 'react-redux';
import ReactDOM from 'react-dom'

import actions from '../redux/actions';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

import {
  Row,
  Col,
  Grid,
  Panel,
  Table,
  PanelBody,
  PanelHeader,
  FormControl,
  PanelContainer,
  Icon,
  Button,
} from '@sketchpixy/rubix';

import url from 'url';

const viewName = 'academicsession';

@connect(state => ({
  session: state.session,
  location: state.location,
  loading: state.view.loading || false,
  ...state.view.academicsession
}))
export default class Academicsession extends React.Component {
  static fetchData(store) {
    const state = store.getState();
    let query = {
      ...state.location.query
    };
    if (state.view && state.view.viewName === viewName)
      query = {
        ...query,
        ...state.view.academicsession.filter
      };

    store.dispatch({
      type: 'LOADING_MODULE',
      view: viewName
    });

    return store.dispatch(
      actions.academicsession.init(
        {
          masterId: state.session.masterId
        },
        query,
        state.cookies
      )
    );
  }


  render() {
    if (this.props.loading) return <Loading/>;
    let content;
    switch(this.props.viewState) {
      case 'ADD':
      case 'EDIT':
      default:
        content = this.renderList();
    }
    return (
      <Row>
        <Col xs={12}>
          <PanelContainer controls={false}>
            <Panel>
              <PanelHeader className='bg-green'>
                <Grid>
                  <Row>
                    <Col xs={10} className='fg-white'>
                      <h3>Academicsessions</h3>
                    </Col>
                    <Col xs={2}>
                      <h3>
                        <Button
                          inverse
                          outlined
                          style={{marginBottom: 5}}
                          bsStyle='default'
                        >
                          Add New
                        </Button>
                      </h3>
                    </Col>
                  </Row>
                </Grid>
              </PanelHeader>
              <PanelBody>
                <Grid>
                  {content}
                </Grid>
              </PanelBody>
            </Panel>
          </PanelContainer>
        </Col>
      </Row>
    );
  }

  renderList() {
    return (
      <Row key="academicsession-list">
        <Col xs={12}>
          <Table condensed striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
              <tr>
                <th></th>
                <th>
                  <FormControl
                    type='text'
                    onChange={this.makeFilter('academicsessiondetail__name')}
                    value={this.props.filter.academicsessiondetail__name || ''}
                  />
                </th>
                <th></th>
                <th></th>
                <th>
                  <FormControl
                    componentClass="select"
                    placeholder="select"
                    onChange={this.makeFilter('academicsession__is_active')}
                    value={this.props.filter.academicsession__is_active || ''}
                  >
                    <option value=''>All</option>
                    <option value='1'>Active</option>
                    <option value='0'>Inactive</option>
                  </FormControl>
                </th>
                <th>
                  <Icon
                    className={'fg-darkcyan'}
                    style={{fontSize: 20}}
                    glyph={'icon-feather-search'}
                    onClick={::this.search}
                  />
                  <Icon
                    className={'fg-brown'}
                    style={{fontSize: 20}}
                    glyph={'icon-feather-reload'}
                    onClick={::this.reset}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
            {this.props.academicsession.map(this.getDataRow, this)}
            {this.props.academicsession.length === 0 && this.noDataRow()}
            </tbody>
          </Table>
        </Col>
        <Col xs={12}>
          <Pagination
            data={this.props.pageInfo}
            onSelect={::this.changePage}
          />
        </Col>
      </Row>
    );
  }

  getDataRow(academicsession, index) {
    return (
      <tr key={academicsession.id}>
        <td>{index+1}</td>
        <td>{academicsession.academicsessiondetails[0].name}</td>
        <td>{moment(academicsession.start_date).format('YYYY/MM/DD')}</td>
        <td>{moment(academicsession.end_date).format('YYYY/MM/DD')}</td>
        <td>{academicsession.is_active ? 'Active': 'Inactive'}</td>
        <td>
          <Icon
            className={'fg-brown'}
            style={{fontSize: 20}}
            glyph={'icon-simple-line-icons-note'}
          />
          <Icon
            className={academicsession.is_active ? 'fg-deepred': 'fg-darkgreen'}
            style={{fontSize: 20}}
            glyph={academicsession.is_active ?
              'icon-simple-line-icons-close' : 'icon-simple-line-icons-check'}
          />
        </td>
      </tr>
    )
  }

  noDataRow() {
    return (
      <tr key={0}>
        <td colSpan={5}>No data found</td>
      </tr>
    )
  }

  changePage(page) {
    this.props.router.push(
      url.format({
        pathname: this.props.location.pathname,
        query: {
          ...this.props.location.query,
          page: page
        }
      })
    );
  }

  makeFilter(name) {
    let dispatch = this.props.dispatch;
    return event => {
      dispatch({
        type: 'UPDATE_FILTER',
        name,
        value: event.target.value
      });
    }
  }

  search() {
    this.props.router.push('/academicsession');
  }

  reset() {
    this.props.dispatch({
      type: 'RESET_FILTERS'
    });
    this.props.router.push('/academicsession');
  }
}
