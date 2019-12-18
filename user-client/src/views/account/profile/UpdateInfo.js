import React from 'react';
import { Row, Col, Image } from 'react-bootstrap';
import FormUpdateInfoContainer from '../../../containers/FormUpdateInfoContainer';
import FormUploadAvatarContainer from '../../../containers/FormUploadAvatarContainer';

const UpdateInfo = ({ account }) => {
  return (
    <Row>
      {account && (
        <Col xs={12} sm={4} className='mb-3 mb-sm-0'>
          <div>
            <Image
              style={{ width: '100%', maxWidth: 200 }}
              src={account.avatar}
              thumbnail
            />
          </div>
          <FormUploadAvatarContainer />
        </Col>
      )}
      {account && (
        <Col xs={12} sm={8} style={{ maxWidth: 450 }}>
          <FormUpdateInfoContainer />
        </Col>
      )}
    </Row>
  );
};

export default UpdateInfo;
