import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';

import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import reducer from '../reducer';
import saga from '../saga';
import { loadArchivesRequest } from '../actions';
import { makeSelectArchives, makeSelectArchiveLoading } from '../selectors';
import { IMAGE_BASE } from '../../App/constants';
import ArchiveSkeleton from '../Skeleton/Archive';

function Archives(props) {
  const { loading, archives, loadArchive } = props;

  useEffect(() => {
    archives.length === 0 && loadArchive();
  }, []);

  return loading ? (
    <ArchiveSkeleton />
  ) : (
      <>
        <div className="mt-10 mb-4">
          <h3 className="font-medium text-xl uppercase">Archives</h3>
          <div className="pt-4">
            {archives &&
              archives.map(each =>
                each != null ? (
                  <div
                    key={`recents-${each}`}
                    className="border-b border-dotted border-gray-600"
                  >
                    <Link
                      className="block py-3 no-underline text-gray-700 hover:text-black"
                      to={`/blog/date/${moment(each).format('YYYY-MM')}`}
                    >
                      <time>{moment(each).format('MMMM YYYY')}</time>
                    </Link>
                  </div>
                ) : (
                    ''
                  ),
              )}
          </div>
        </div>
      </>
    );
}

Archives.propTypes = {
  loading: PropTypes.bool.isRequired,
  archives: PropTypes.array.isRequired,
};

const withReducer = injectReducer({ key: 'blogPage', reducer });
const withSaga = injectSaga({ key: 'blogPage', saga });

const mapStateToProps = createStructuredSelector({
  archives: makeSelectArchives(),
  loading: makeSelectArchiveLoading(),
});

const mapDispatchToProps = dispatch => ({
  loadArchive: payload => dispatch(loadArchivesRequest(payload)),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(Archives);
