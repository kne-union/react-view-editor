import { preset as formReset } from '@kne/react-form-antd';
import get from 'lodash/get';

export const avatarParams = {
  field: {
    avatar: {
      action: '/open-api/upload_static_file/view-editor',
      transformResponse: response => {
        return {
          code: response.code,
          msg: response.msg,
          results: get(response, 'results[0].targetPath')
        };
      }
    },
    upload: {
      action: '/open-api/upload_static_file/view-editor',
      transformResponse: response => {
        return {
          code: response.code,
          msg: response.msg,
          results: get(response, 'results[0].targetPath')
        };
      }
    }
  }
};

formReset(avatarParams);