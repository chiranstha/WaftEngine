import * as types from './constants';

export const loadBlogRequest = payload => ({
  type: types.LOAD_BLOG_REQUEST,
  payload,
});
export const loadBlogSuccess = payload => ({
  type: types.LOAD_BLOG_SUCCESS,
  payload,
});
export const loadBlogFailure = payload => ({
  type: types.LOAD_BLOG_FAILURE,
  payload,
});
export const loadRelatedBlogsRequest = payload => ({
  type: types.LOAD_RELATED_BLOGS_REQUEST,
  payload,
});
export const loadRelatedBlogsSuccess = payload => ({
  type: types.LOAD_RELATED_BLOGS_SUCCESS,
  payload,
});
export const loadRelatedBlogsFailure = payload => ({
  type: types.LOAD_RELATED_BLOGS_FAILURE,
  payload,
});

export const loadRecentBlogsRequest = payload => ({
  type: types.LOAD_RECENT_BLOGS_REQUEST,
  payload,
});
export const loadRecentBlogsSuccess = payload => ({
  type: types.LOAD_RECENT_BLOGS_SUCCESS,
  payload,
});
export const loadRecentBlogsFailure = payload => ({
  type: types.LOAD_RECENT_BLOGS_FAILURE,
  payload,
});
export const setOneValue = payload => ({
  type: types.SET_ONE_VALUE,
  payload,
});
export const loadCommentRequest = payload => ({
  type: types.LOAD_COMMENT_REQUEST,
  payload,
});
export const loadCommentSuccess = payload => ({
  type: types.LOAD_COMMENT_SUCCESS,
  payload,
});
export const loadCommentFailure = payload => ({
  type: types.LOAD_COMMENT_FAILURE,
  payload,
});
export const postCommentRequest = payload => ({
  type: types.POST_COMMENT_REQUEST,
  payload,
});
export const postCommentSuccess = payload => ({
  type: types.POST_COMMENT_SUCCESS,
  payload,
});
export const postCommentFailure = payload => ({
  type: types.POST_COMMENT_FAILURE,
  payload,
});
export const editCommentSuccess = payload => ({
  type: types.EDIT_COMMENT_SUCCESS,
  payload,
});

export const deleteCommentRequest = payload => ({
  type: types.DELETE_COMMENT_REQUEST,
  payload,
});
export const deleteCommentSuccess = payload => ({
  type: types.DELETE_COMMENT_SUCCESS,
  payload,
});
export const deleteCommentFailure = payload => ({
  type: types.DELETE_COMMENT_FAILURE,
  payload,
});

export const loadOneRequest = payload => ({
  type: types.LOAD_ONE_REQUEST,
  payload,
});
export const loadOneSuccess = payload => ({
  type: types.LOAD_ONE_SUCCESS,
  payload,
});
export const loadOneFailure = payload => ({
  type: types.LOAD_ONE_FAILURE,
  payload,
});

export const clearOne = payload => ({
  type: types.CLEAR_ONE,
  payload,
});

export const loadArchivesRequest = payload => ({
  type: types.LOAD_ARCHIVES_REQUEST,
  payload,
});
export const loadArchivesSuccess = payload => ({
  type: types.LOAD_ARCHIVES_SUCCESS,
  payload,
});
export const loadArchivesFailure = payload => ({
  type: types.LOAD_ARCHIVES_FAILURE,
  payload,
});
