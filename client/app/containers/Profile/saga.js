import {
  takeLatest,
  take,
  call,
  fork,
  put,
  select,
  cancel,
} from 'redux-saga/effects';
import { push, LOCATION_CHANGE } from 'connected-react-router';
import Api from 'utils/Api';
import { makeSelectToken } from '../App/selectors';
import * as types from './constants';
import { enqueueSnackbar } from '../App/actions';
import * as actions from './actions';
import { makeSelectUser } from '../App/selectors';

function* loadOne() {
  const token = yield select(makeSelectToken());
  yield call(
    Api.get(
      'user/profile',
      actions.loadOneSuccess,
      actions.loadOneFailure,
      token,
    ),
  );
}

function* redirectOnSuccess() {
  yield take(types.ADD_EDIT_SUCCESS);
  // yield put(push('/user/my-account'));
}

function* addEdit() {
  const successWatcher = yield fork(redirectOnSuccess);
  const token = yield select(makeSelectToken());
  const data = yield select(makeSelectOne());
  yield fork(
    Api.post(
      'user/profile',
      actions.addEditSuccess,
      actions.addEditFailure,
      data,
      token,
    ),
  );
  yield take([LOCATION_CHANGE, types.ADD_EDIT_FAILURE]);
  yield cancel(successWatcher);
}

function* addEditSuccessful(action) {
  const defaultMsg = {
    message: action.payload.msg || 'User Profile Updated',
    options: {
      variant: 'success',
    },
  };

  yield put(enqueueSnackbar(defaultMsg));
}

function* redirectOnSuccessChangePP() {
  yield take(types.CHANGE_PASSWORD_SUCCESS);
  // yield put(logoutRequest());
}

function* changePassword(action) {
  const successWatcher = yield fork(redirectOnSuccessChangePP);

  const token = yield select(makeSelectToken());
  yield fork(
    Api.post(
      'user/changepassword',
      actions.changePasswordSuccess,
      actions.changePasswordFailure,
      action.payload,
      token,
    ),
  );

  yield take([LOCATION_CHANGE, types.CHANGE_PASSWORD_FAILURE]);
  yield cancel(successWatcher);
}

function* redirectOnVerifySuccess() {
  yield take(types.VERIFY_EMAIL_SUCCESS);
  yield put(push('/user/profile'));
}

function* verifyEmail(action) {
  const successWatcher = yield fork(redirectOnVerifySuccess);
  const token = yield select(makeSelectToken());
  const user = yield select(makeSelectUser());
  yield fork(
    Api.post(
      `user/verifymail`,
      actions.verifyEmailSuccess,
      actions.verifyEmailFailure,
      { email: user.email, code: action.payload },
      token,
    ),
  );
  yield take([LOCATION_CHANGE, types.VERIFY_EMAIL_FAILURE]);
  yield cancel(successWatcher);
}

function* verifyEmailFailFunc(action) {
  const defaultMsg = {
    message: action.payload.msg || 'Something went wrong while verifying!!',
    options: {
      variant: 'warning',
    },
  };

  yield put(enqueueSnackbar(defaultMsg));
}

function* verifyEmailSuccFunc(action) {
  const defaultMsg = {
    message: action.payload.msg || 'Email verified successfully!!',
    options: {
      variant: 'success',
    },
  };

  yield put(enqueueSnackbar(defaultMsg));
}

function* changepwSuccessful(action) {
  const defaultMsg = {
    message: action.payload.msg || 'password change success!!',
    options: {
      variant: 'success',
    },
  };

  yield put(enqueueSnackbar(defaultMsg));
}

function* resendCode() {
  const token = yield select(makeSelectToken());
  const user = yield select(makeSelectUser());
  yield call(
    Api.post(
      `user/verifymail/resend`,
      actions.resendCodeSuccess,
      actions.resendCodeFailure,
      { email: user.email },
      token,
    ),
  );
}

function* resendCodeSuccFunc(action) {
  const defaultMsg = {
    message: action.payload.msg || 'code resent successfully!!',
    options: {
      variant: 'success',
    },
  };

  yield put(enqueueSnackbar(defaultMsg));
}

function* resendCodeFailFunc(action) {
  const defaultMsg = {
    message: action.payload.msg || 'code resent failure!!',
    options: {
      variant: 'warning',
    },
  };

  yield put(enqueueSnackbar(defaultMsg));
}

export default function* userPersonalInformationPageSaga() {
  yield takeLatest(types.LOAD_ONE_REQUEST, loadOne);
  yield takeLatest(types.VERIFY_EMAIL_REQUEST, verifyEmail);
  yield takeLatest(types.VERIFY_EMAIL_FAILURE, verifyEmailFailFunc);
  yield takeLatest(types.VERIFY_EMAIL_SUCCESS, verifyEmailSuccFunc);
  yield takeLatest(types.ADD_EDIT_REQUEST, addEdit);
  yield takeLatest(types.ADD_EDIT_SUCCESS, addEditSuccessful);
  yield takeLatest(types.CHANGE_PASSWORD_REQUEST, changePassword);
  yield takeLatest(types.CHANGE_PASSWORD_SUCCESS, changepwSuccessful);
  yield takeLatest(types.RESEND_CODE_REQUEST, resendCode);
  yield takeLatest(types.RESEND_CODE_SUCCESS, resendCodeSuccFunc);
  yield takeLatest(types.RESEND_CODE_FAILURE, resendCodeFailFunc);
}
