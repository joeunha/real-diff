import { PayloadAction } from '@reduxjs/toolkit'
import { call,put,select,takeLatest } from 'redux-saga/effects'

import { FetchStatusCode } from '@/api'
import { IgnoredFile } from '@/domain/ignoreFile'
import { PULL_REQUEST_REGEX } from '@/domain/pullRequest'
import { currentPath,redirect } from '@/utils/history'
import { STORAGE_KEY,storageUtil } from '@/utils/storage'
import { isMatchedPattern } from '@/utils/validation'

import { settingActions, settingSelector } from './settingSlice'

function* saveUserToken({payload}: PayloadAction<string>) {
  yield call(
    storageUtil.saveData,
    STORAGE_KEY.GITHUB_TOKEN,
    payload,
  )

  yield call(redirect, '/')
}

export function* watchSaveUserToken() {
  yield takeLatest(
    settingActions.saveToken,
    saveUserToken,
  )
}

function* getCurrentPath() {
  const path = yield call(currentPath)

  if (isMatchedPattern(PULL_REQUEST_REGEX, path)) {
    const pathName = path.split('/')
    yield put(
      settingActions.setPathSuccess({
        value: {
          orgName: pathName[3],
          repository: pathName[4],
          prNumber: pathName[6],
        },
        fetchState: FetchStatusCode.OK,
      }),
    )

    return
  }

  yield put(
    settingActions.setPathFail(FetchStatusCode.UNKNOWN),
  )
}

export function* watchRequestPath() {
  yield takeLatest(
    settingActions.requestPath,
    getCurrentPath,
  )
}

function* syncIgnoreFileFromStorage() {
  const initialFileList = yield select(
    settingSelector.ignoreFileList,
  )
  const storedIgnoreList = yield call(
    storageUtil.getData,
    STORAGE_KEY.IGNORE_FILE_LIST,
  )
  if (!storedIgnoreList) {
    yield call(
      storageUtil.saveData,
      STORAGE_KEY.IGNORE_FILE_LIST,
      initialFileList,
    )

    return
  }

  yield put(
    settingActions.setIgnoreFileListSuccess(
      storedIgnoreList,
    ),
  )
}

export function* watchSyncIgnoreFileList() {
  yield takeLatest(
    settingActions.syncIgnoreFileList,
    syncIgnoreFileFromStorage,
  )
}

function* saveIgnoreFileToStorage() {
  const existFileList: IgnoredFile[] = yield select(
    settingSelector.ignoreFileList,
  )
  yield call(
    storageUtil.saveData,
    STORAGE_KEY.IGNORE_FILE_LIST,
    existFileList,
  )
}

export function* watchSaveIgnoreFile() {
  yield takeLatest(
    settingActions.addIgnoreFile,
    saveIgnoreFileToStorage,
  )
  yield takeLatest(
    settingActions.removeIgnoreFile,
    saveIgnoreFileToStorage,
  )
}

function* checkTokenExistAtStorage() {
  const token = yield call(
    storageUtil.getData,
    STORAGE_KEY.GITHUB_TOKEN,
  )

  if (!token) {
    yield put(settingActions.checkTokenExistSuccess(FetchStatusCode.EMPTY))

    return
  }

  yield put(settingActions.checkTokenExistSuccess(FetchStatusCode.OK))
}

export function* watchCheckTokenExist() {
  yield takeLatest(
    settingActions.checkTokenExist,
    checkTokenExistAtStorage,
  )
}
