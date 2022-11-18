import { TUid } from '@_node/types';
import {
  FFNodeActionUpdatePayload,
  FFNodeType,
} from '@_types/ff';

import { getFFNodeType } from './services';
import { FFApiRes } from './types';

const fs = require('fs-extra')

/**
 * read file content based on the path
 * @param pathName 
 * @returns 
 */
export async function readFileContent(pathName: string): Promise<FFApiRes> {
  // validate
  const nodeType: FFNodeType = await getFFNodeType(pathName)
  if (nodeType !== 'file') {
    return {
      success: false,
      error: 'It\'s not a file',
    }
  }

  // read file content
  return fs.readFile(pathName)
    .then((data: Buffer) => {
      return {
        success: true,
        data: data.toString('utf-8'),
      }
    })
    .catch((err: string) => {
      return {
        sucess: false,
        error: err,
      }
    })
}

/**
 * write File Content
 * @param param0 
 * @returns 
 */
export async function writeFileContent({ file, content }: FFNodeActionUpdatePayload): Promise<FFApiRes> {
  const fullPath = file.uid

  // validate
  const ffNodeType: FFNodeType = await getFFNodeType(fullPath)
  if (ffNodeType !== "file") {
    return {
      success: false,
      error: "It's not a valid file",
    }
  }

  // write content
  return fs.writeFile(fullPath, content)
    .then(() => {
      return {
        success: true,
      }
    })
    .catch((err: any) => {
      return {
        sucess: false,
        error: err,
      }
    })
}

/**
 * rename folder/file with the newName
 * @param pathName 
 * @param newPathName 
 * @returns 
 */
export async function renameFF(pathName: string, newPathName: string): Promise<FFApiRes> {
  // validate
  const nodeType: FFNodeType = await getFFNodeType(pathName)
  if (nodeType === 'unlink') {
    return {
      success: false,
      error: 'It\'s not a valid folder or file',
    }
  }

  // rename the FF
  return fs.rename(pathName, newPathName)
    .then(() => {
      return {
        success: true,
      }
    })
    .catch((err: string) => {
      return {
        success: false,
        error: err
      }
    })
}

/**
 * delete folder/file with the name
 * @param uid 
 * @returns 
 */
export async function deleteFF(uid: TUid): Promise<FFApiRes> {
  const fullPath = uid

  // validate
  const nodeType: FFNodeType = await getFFNodeType(fullPath)
  if (nodeType === "unlink") {
    return {
      success: false,
      error: 'It\'s not a valid folder or file',
    }
  }

  // delete file
  if (nodeType === 'file') {
    return fs.unlink(fullPath)
      .then(() => {
        return {
          success: true,
        }
      })
      .catch((err: any) => {
        return {
          success: false,
          error: err
        }
      })
  }

  // delete folder
  return fs.rm(fullPath, { recursive: true, force: true })
    .then(() => {
      return {
        success: true,
      }
    })
    .catch((err: any) => {
      return {
        success: false,
        error: err
      }
    })
}

/*
export async function createFF({ from, payload }: FFNodeActionAddPayload): Promise<FFApiRes> {
  const fullPath = getFullPath(from)
  const { name, type } = payload

  const ffNodeType: FFNodeType = await getFFNodeType(fullPath)
  if (ffNodeType !== "folder") {
    return {
      success: false,
      error: "You are trying to creat file not inside the folder",
    }
  }

  if (type === "file") {
    return fs.writeFile(path.join(fullPath, name), "")
      .then(() => {
        return {
          success: true,
        }
      })
      .catch((err: any) => {
        return {
          sucess: false,
          error: err
        }
      })
  } else if (type === "folder") {
    return fs.mkdir(path.join(fullPath, name), { recursive: true })
      .then(() => {
        return {
          success: true,
        }
      })
      .catch((err: any) => {
        if (err) throw err;
      });
  }

  return {
    success: false,
    error: 'Unknown Error',
  }
}


export async function moveFF({ from, to, payload }: FFNodeActionMovePayload): Promise<FFApiRes> {
  const to_fullpath = getFullPath(to)
  const from_fullpath = getFullPath(from)
  const toNodeType: FFNodeType = await getFFNodeType(to_fullpath)
  const fromNodeType: FFNodeType = await getFFNodeType(from_fullpath);

  if (toNodeType !== "folder") {
    return {
      success: false,
      error: "You can only move it to folder",
    }
  }
  if (fromNodeType === "file") {
    return fs.move(from_fullpath, path.join(to_fullpath, from.name), { overwrite: payload.overwrite })
      .then(() => {
        return {
          success: true,
        }
      })
      .catch((err: any) => {
        return {
          success: false,
          error: err,
        }
      })
  }
  else if (fromNodeType === "folder") {
    return fs.move(from_fullpath, path.join(to_fullpath, from.name), { overwrite: payload.overwrite })
      .then(() => {
        return {
          success: true,
        }
      })
      .catch((err: any) => {
        return {
          success: false,
          error: err
        }
      })
  }
  return {
    success: false,
    error: 'Unknown error'
  }
}

export async function duplicateFF({ from, to, payload }: FFNodeActionDuplicatePayload): Promise<FFApiRes> {
  const fromFullPath = getFullPath(from)
  const toFullPath = getFullPath(to)
  const fromNodeType: FFNodeType = await getFFNodeType(fromFullPath)
  const toNodeType: FFNodeType = await getFFNodeType(toFullPath)
  if (toNodeType !== "folder") {
    return {
      success: false,
      error: 'Destination is not folder.',
    }
  }
  if (fromNodeType == "file") {
    return fs.copy(fromFullPath, path.join(toFullPath, from.name), { overwrite: payload.overwrite })
      .then(() => {
        return {
          success: true,
        }
      })
      .catch((err: any) => {
        return {
          success: false,
          error: err
        }
      })
  }
  else {
    return fs.copy(fromFullPath, toFullPath, { overwrite: payload.overwrite })
      .then(() => {
        return {
          success: true,
        }
      })
      .catch((err: any) => {
        return {
          success: false,
          error: err
        }
      })
  }
}
*/