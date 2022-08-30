import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Menu } from 'semantic-ui-react';
import { Responsive } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';
import { onLogin } from 'lib/common';

interface Props {
  location: {
    state: {
      devMessage: string;
    };
  };
}

const NoAuthPage = (props: Props) => {
  const [id, setId] = useState<string>('myutopia@sk.com');

  const reset = () => {
    window.location.href = '/';
  };

  return (
    <Responsive {...Responsive.onlyComputer}>
      <Menu secondary className="m-gnb">
        <Menu.Item>
          <div className="g-logo">
            <Link to="/">
              <i className="sk-university icon">
                <span className="blind">SUNI</span>
              </i>
            </Link>
          </div>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item className="login-info">
            {process.env.NODE_ENV === 'development' && (
              <>
                <input value={id} onChange={(e) => setId(e.target.value)} />
                <button onClick={() => onLogin(id)} type="button">
                  로그인
                </button>
              </>
            )}
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <Container fluid>
        <div
          style={{
            justifyContent: 'center',
            height: 'calc(100vh - 150px)',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            flexFlow: 'column',
          }}
        >
          <p style={{ fontSize: '20px', fontWeight: 400 }}>잘못된 접근 경로 입니다</p>
          {`${process.env.NODE_ENV}` === 'development' && props.location.state ? (
            <p>{`devMessage : ${props.location.state.devMessage}`}</p>
          ) : null}
          <div>
            <Button primary type="button" onClick={reset}>
              GO HOME
            </Button>
          </div>
        </div>
      </Container>
    </Responsive>
  );
};

export default NoAuthPage;
