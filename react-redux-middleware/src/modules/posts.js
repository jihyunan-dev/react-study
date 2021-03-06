import { call, put, takeEvery } from "@redux-saga/core/effects";
import * as postApi from "../api/posts";
import {
  createPromiseThunk,
  createPromiseThunkById,
  reducerUtils,
  handleAsyncActions,
  handleAsyncActionById,
} from "../lib/asyncUtils";

// 액션
const GET_POSTS = "GET_POSTS";
const GET_POSTS_SUCCESS = "GET_POSTS_SUCCESS";
const GET_POSTS_ERROR = "GET_POSTS_ERROR";

const GET_POST = "GET_POST";
const GET_POST_SUCCESS = "GET_POST_SUCCESS";
const GET_POST_ERROR = "GET_POST_ERROR";
//const CLEAR_POST = "CLEAR_POST";

// 액션 함수

// 리팩토링 전
// export const getPosts = () => async (dispatch) => {
//   dispatch({ type: GET_POSTS });
//   try {
//     const posts = await postApi.getPosts();
//     dispatch({ type: GET_POSTS_SUCCESS, posts });
//   } catch (error) {
//     dispatch({ type: GET_POSTS_ERROR, error });
//   }
// };

// export const getPost = () => async (dispatch) => {
//   dispatch({ type: GET_POST });
//   try {
//     const post = await postApi.getPost();
//     dispatch({ type: GET_POST_SUCCESS, post });
//   } catch (error) {
//     dispatch({ type: GET_POST_ERROR, error });
//   }
// };

// 리팩토링 후
// export const getPosts = createPromiseThunk(GET_POSTS, postApi.getPosts);
// export const getPost = createPromiseThunkById(GET_POST, postApi.getPostById);
//export const clearPost = () => ({ type: CLEAR_POST });

/* redux-saga 사용*/
export const getPosts = () => ({ type: GET_POSTS });
export const getPost = (id) => ({ type: GET_POST, payload: id, meta: id }); // payload는 파라미터 용도, meta는 리듀서에서 id 확인 용도

function* getPostsSaga() {
  try {
    const posts = yield call(postApi.getPosts);
    yield put({
      type: GET_POSTS_SUCCESS,
      payload: posts,
    });
  } catch (error) {
    yield put({
      type: GET_POSTS_ERROR,
      error,
    });
  }
}

function* getPostSaga(action) {
  const param = action.payload;
  const id = action.meta;
  try {
    const post = yield call(postApi.getPostById, param);
    yield put({
      type: GET_POST_SUCCESS,
      payload: post,
      meta: id,
    });
  } catch (error) {
    yield put({
      type: GET_POST_ERROR,
      error: error,
      meta: id,
    });
  }
}

export function* postsSaga() {
  yield takeEvery(GET_POSTS, getPostsSaga);
  yield takeEvery(GET_POST, getPostSaga);
}

// 리팩토링 전
// const initialState = {
//   posts: {
//     loading: false,
//     data: null,
//     error: null,
//   },
//   post: {
//     laoding: false,
//     data: null,
//     error: null,
//   },
// };

// 리팩토링 후
const initialState = {
  posts: reducerUtils.initial(),
  post: {},
};

// 리팩토링 전
// export default function posts(state = initialState, action) {
//   switch (action.type) {
//     case GET_POSTS:
//       return {
//         ...state,
//         posts: reducerUtils.loading(),
//       };
//     case GET_POSTS_SUCCESS:
//       return {
//         ...state,
//         posts: reducerUtils.success(action.payload),
//       };
//     case GET_POSTS_ERROR:
//       return {
//         ...state,
//         posts: reducerUtils.error(action.error),
//       };
//     case GET_POST:
//       return {
//         ...state,
//         post: reducerUtils.loading(),
//       };
//     case GET_POST_SUCCESS:
//       return {
//         ...state,
//         post: reducerUtils.payload(action.payload),
//       };
//     case GET_POST_ERROR:
//       return {
//         ...state,
//         post: reducerUtils.error(action.error),
//       };
//     default:
//       return state;
//   }
// }

// 리팩토링 후
export default function posts(state = initialState, action) {
  switch (action.type) {
    case GET_POST:
    case GET_POST_SUCCESS:
    case GET_POST_ERROR:
      return handleAsyncActionById(GET_POST, "post")(state, action);
    case GET_POSTS:
    case GET_POSTS_SUCCESS:
    case GET_POSTS_ERROR:
      return handleAsyncActions(GET_POSTS, "posts", true)(state, action);
    default:
      return state;
  }
}
