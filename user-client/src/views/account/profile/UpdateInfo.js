import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import FormUpdateInfo from '../../../containers/FormUpdateInfoContainer';
import FormUploadAvatar from '../../../containers/FormUploadAvatarContainer';
import avatarDefault from '../../../assets/imgs/avatar.jpg';

const UpdateInfo = ({ account }) => {
  let avatar = avatarDefault;
  if (account && account.avatar) {
    avatar = account.avatar;
  }
  return (
    <Row>
      {account && (
        <Col xs={12} sm={4} className='mb-3 mb-sm-0'>
          <div>
            <Image
              style={{ width: '100%', maxWidth: 200 }}
              src={avatar}
              thumbnail
            />
          </div>
          <FormUploadAvatar />
        </Col>
      )}
      {account && (
        <Col xs={12} sm={8} style={{ maxWidth: 450 }}>
          <FormUpdateInfo />
        </Col>
      )}
    </Row>
  );
};

export default UpdateInfo;
