import React from "react";
import PropTypes from "prop-types";
import kwMiningActions from './actions/kwMiningActions';
import {connect} from "./RxState";
import {Navbar} from "./components/navbar";
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class KeywordMiningPage extends React.Component {
  constructor(props) {
    super(props);

    this.handleQueryStringChange = this.handleQueryStringChange.bind(this);
    this.handleQueryStringSearch = this.handleQueryStringSearch.bind(this);
  }

  componentDidMount() {
    this.props.search(this.props.location.search)
  }

  handleQueryStringChange(event) {
    this.props.searchInput(event)
  }

  handleQueryStringSearch() {
    this.props.searchClick('click')
  }

  render () {
    const {kwMining: {res, loading}} = this.props;
    const columns = [{
      Header: '关键词',
      accessor: 'seed',
      sortable: false,
      filterable: true
    }];
    return (
      <div className="KeywordMiningPage">
        <Navbar>
          <Navbar.Section>
            <Navbar.Brand>关键词挖掘</Navbar.Brand>
          </Navbar.Section>
          <Navbar.Section>
            <div className="input-group input-inline">
              <input className="form-input" type="text" placeholder={this.props.kwMining.searchQuery} onChange={this.handleQueryStringChange}/>
                <button className="btn btn-primary input-group-btn" onClick={this.handleQueryStringSearch}>搜索</button>
            </div>
          </Navbar.Section>
        </Navbar>
        <ReactTable
          data={res}
          columns={columns}
          defaultPageSize={50}
          noDataText='暂无数据'
          loading={loading}
          loadingText='加载中...'
        />
      </div>
    )
  }
}

KeywordMiningPage.propTypes = {
  kwMining: PropTypes.object.isRequired,
  search: PropTypes.func.isRequired,
  cancelSearch: PropTypes.func.isRequired
};

export default connect(({ kwMining }) => ({ kwMining }), kwMiningActions)(KeywordMiningPage);