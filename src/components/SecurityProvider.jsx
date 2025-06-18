import { Helmet } from 'react-helmet';
import Cookies from 'js-cookie';
import { useEffect } from 'react';

const SecurityProvider = ({ children }) => {
  useEffect(() => {
    // Configuration des cookies sécurisés
    Cookies.defaults = {
      secure: true,
      sameSite: 'strict',
      expires: 7 // 7 jours
    };

    // Protection contre le clickjacking
    if (window.self !== window.top) {
      window.top.location = window.self.location;
    }
  }, []);

  return (
    <>
      <Helmet>
        {/* En-têtes de sécurité */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com;" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />
      </Helmet>
      {children}
    </>
  );
};

export default SecurityProvider; 