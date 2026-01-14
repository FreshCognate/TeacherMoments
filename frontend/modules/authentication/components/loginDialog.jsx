import React, { useEffect, useRef, useState } from 'react';
import FormContainer from '~/core/forms/containers/formContainer';
import Alert from '~/uikit/alerts/components/alert';
import Button from '~/uikit/buttons/components/button';

const LoginDialog = ({
  model,
  hasError,
  error,
  onLoginFormUpdate,
  onLoginButtonClicked
}) => {
  const turnstileRef = useRef(null);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const TURNSTILE_SITE_KEY = window.TURNSTILE_SITE_KEY;
  const TURNSTILE_ENABLED = window.TURNSTILE_ENABLED !== 'false';

  useEffect(() => {

    if (!TURNSTILE_ENABLED || !TURNSTILE_SITE_KEY) {
      setTurnstileToken('disabled');
      return;
    }

    if (!window.turnstile) {
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        renderTurnstile();
      };
    } else {
      renderTurnstile();
    }

    return () => {
      if (turnstileRef.current && window.turnstile) {
        window.turnstile.remove(turnstileRef.current);
      }
    };
  }, []);

  const renderTurnstile = () => {
    if (window.turnstile && !turnstileRef.current) {
      turnstileRef.current = window.turnstile.render('#turnstile-widget', {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token) => {
          setTurnstileToken(token);
        },
        'error-callback': () => {
          setTurnstileToken(null);
        },
        'expired-callback': () => {
          setTurnstileToken(null);
        }
      });
    }
  };

  const handleLogin = () => {
    onLoginButtonClicked(turnstileToken);
  };

  return (
    <div className="px-4 pb-4">
      <FormContainer
        schema={{
          email: {
            type: 'Text',
            label: 'Email'
          }
        }}
        model={model}
        onUpdate={onLoginFormUpdate}
      />

      {TURNSTILE_ENABLED && TURNSTILE_SITE_KEY && (
        <div id="turnstile-widget" className="my-4"></div>
      )}

      {(hasError) && (
        <div className="py-4">
          <Alert text={error} type="warning" />
        </div>
      )}
      <Button
        text="Login"
        onClick={handleLogin}
        isDisabled={!turnstileToken}
      />
    </div>
  );
};

export default LoginDialog;