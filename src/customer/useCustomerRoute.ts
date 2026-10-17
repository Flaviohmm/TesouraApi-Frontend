import { useCallback, useEffect, useState } from 'react';

export type CustomerScreen = 'directory' | 'salon' | 'login' | 'register' | 'my-bookings';

export type CustomerRoute = {
  screen: CustomerScreen;
  slug?: string;
  returnTo: string;
  appointmentId?: string;
  stripeReturn?: boolean;
};

function parse(pathname: string, search: string): CustomerRoute {
  const parts = pathname.replace(/^\/descobrir\/?/, '').split('/').filter(Boolean);
  const params = new URLSearchParams(search);
  const returnTo = params.get('returnTo') || '/descobrir';
  const appointmentId = params.get('appointmentId') || undefined;
  const stripeReturn = params.get('stripeReturn') === '1';

  if (parts[0] === 'salao' && parts[1]) return { screen: 'salon', slug: parts[1], returnTo, appointmentId, stripeReturn };
  if (parts[0] === 'login') return { screen: 'login', returnTo };
  if (parts[0] === 'registrar') return { screen: 'register', returnTo };
  if (parts[0] === 'minhas-reservas') return { screen: 'my-bookings', returnTo };
  return { screen: 'directory', returnTo };
}

export function useCustomerRoute() {
  const [route, setRoute] = useState(() => parse(window.location.pathname, window.location.search));

  useEffect(() => {
    const onPop = () => setRoute(parse(window.location.pathname, window.location.search));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState({}, '', path);
    const [pathname, search = ''] = path.split('?');
    setRoute(parse(pathname, search ? `?${search}` : ''));
  }, []);

  return { ...route, navigate };
}
