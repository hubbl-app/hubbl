import * as swr from 'swr';

import * as ctx from '@hubbl/data-access/contexts';
import {
  AppContextValue,
  AppProvider,
  LoadingContext,
  ToastContext
} from '@hubbl/data-access/contexts';
import { GymZoneDTO } from '@hubbl/shared/models/dto';
import { createTheme, ThemeProvider } from '@mui/material';
import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DashboardGymZones from './DashboardGymZones';

jest.mock('@hubbl/data-access/contexts', () => {
  const actual = jest.requireActual('@hubbl/data-access/contexts');
  const app = jest.fn();
  const toast = jest.fn();

  return { ...actual, useAppContext: app, useToastContext: toast };
});
jest.mock('axios');

const response = [
  {
    id: 1,
    name: 'One',
    description: 'One Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    calendar: 1,
    isClassType: false,
    covidPassport: true,
    maskRequired: true,
    virtualGym: 1
  },
  {
    id: 2,
    name: 'Two',
    description: 'Two Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    calendar: 1,
    isClassType: false,
    covidPassport: true,
    maskRequired: true,
    virtualGym: 1
  },
  {
    id: 3,
    name: 'Three',
    description: 'Three Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    calendar: 1,
    isClassType: false,
    covidPassport: true,
    maskRequired: true,
    virtualGym: 1
  },
  {
    id: 4,
    name: 'Four',
    description: 'Four Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    calendar: 1,
    isClassType: false,
    covidPassport: true,
    maskRequired: true,
    virtualGym: 1
  },
  {
    id: 5,
    name: 'Five',
    description: 'Five Description',
    capacity: 25,
    openTime: '09:00',
    closeTime: '23:00',
    calendar: 1,
    isClassType: false,
    covidPassport: true,
    maskRequired: true,
    virtualGym: 1
  }
] as GymZoneDTO[];

const renderComponent = () =>
  render(
    <LoadingContext>
      <ThemeProvider theme={createTheme()}>
        <ToastContext>
          <AppProvider>
            <DashboardGymZones />
          </AppProvider>
        </ToastContext>
      </ThemeProvider>
    </LoadingContext>
  );

const fillGymZone = async () => {
  await act(async () => {
    fireEvent.click(screen.getByTitle('add-gym-zone'));
  });
  await act(async () => {
    fireEvent.input(screen.getByPlaceholderText('New name'), {
      target: { name: 'name', value: 'Name' }
    });
    fireEvent.input(screen.getByPlaceholderText('New gym zone description'), {
      target: { name: 'description', value: 'Gym zone description' }
    });
    fireEvent.input(screen.getByPlaceholderText('200'), {
      target: { name: 'capacity', value: '25' }
    });

    await userEvent.type(screen.getByPlaceholderText('09:00'), '1000');
    await userEvent.type(screen.getByPlaceholderText('23:00'), '2200');

    // TODO: FIX ASYNC USER EVENT
  });
  await act(async () => {
    await userEvent.click(screen.getByText('Save'));
  });
};

describe('<DashboardGymZones />', () => {
  // Constants have to be used so useEffect is not infinitely triggered
  const emptyResponse = {};
  const defaultResponse = { data: [response[0]] };

  const hasAccess = () => true;

  const fetcher = jest.fn();
  const poster = jest.fn();

  const onSuccess = jest.fn();

  const onError = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();

    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {
        parsed: { id: 1, email: 'some@email.com', user: 'owner' },
        value: 'token'
      },
      user: { firstName: 'Test', lastName: 'User', gym: { id: 1 } },
      helpers: { hasAccess },
      API: { fetcher, poster }
    } as any);
    (ctx.useToastContext as jest.Mock).mockReturnValue({ onSuccess, onError });
  });

  it('should not fetch without a token', async () => {
    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {},
      user: {},
      helpers: { hasAccess: () => true },
      API: {}
    } as any);
    jest.spyOn(swr, 'default').mockImplementation((cb) => {
      expect(cb).toBe(null);

      return {} as never;
    });

    await act(async () => {
      renderComponent();
    });
  });

  it('should render the list of gym zones', async () => {
    jest.spyOn(swr, 'default').mockImplementation((cb, f, opt) => {
      expect(f).toBe(fetcher);
      if (cb) {
        expect(cb).toBe(`/dashboards/1`);
      }
      expect(opt).toStrictEqual({ revalidateOnFocus: false });

      return { data: { gymZones: response } } as never;
    });

    await act(async () => {
      renderComponent();
    });

    // Find gym zones
    response.forEach(({ name }) => {
      expect(screen.getByText(name.toUpperCase())).toBeInTheDocument();
    });
    // Find placeholder
    expect(screen.getByTitle('add-gym-zone')).toBeInTheDocument();
  });

  it('should not show the button if user does not have permissions', async () => {
    (ctx.useAppContext as jest.Mock<AppContextValue>).mockReturnValue({
      token: {
        parsed: { id: 1, email: 'some@email.com', user: 'worker' },
        value: 'token'
      },
      user: { firstName: 'Test', lastName: 'User', gym: { id: 1 } },
      helpers: { hasAccess: () => false },
      API: { fetcher, poster }
    } as any);
    jest.spyOn(swr, 'default').mockImplementation((cb, f, opt) => {
      expect(f).toBe(fetcher);
      if (cb) {
        expect(cb).toBe(`/dashboards/1`);
      }
      expect(opt).toStrictEqual({ revalidateOnFocus: false });

      return { data: { gymZones: response } } as never;
    });

    await act(async () => {
      renderComponent();
    });

    expect(screen.queryByTitle('add-gym-zone')).not.toBeInTheDocument();
  });

  it('should create a new gym zone', async () => {
    const mutateSpy = jest.fn().mockImplementation();
    const virtualGymList = { data: { gymZones: [] }, mutate: mutateSpy };

    jest.spyOn(swr, 'default').mockImplementation((key) => {
      if (!key) {
        return emptyResponse as any;
      }
      if (key !== '/virtual-gyms?level=0') {
        return virtualGymList as never;
      }

      return defaultResponse as never;
    });
    poster.mockImplementation(() => response[0]);

    await act(async () => {
      renderComponent();
    });
    await fillGymZone();

    expect(poster).toHaveBeenCalledTimes(1);
    expect(poster).toHaveBeenCalledWith('/virtual-gyms/1/gym-zones', {
      name: 'Name',
      description: 'Gym zone description',
      isClassType: false,
      maskRequired: true,
      covidPassport: true,
      openTime: '10:00',
      closeTime: '22:00',
      capacity: 25,
      gym: 1,
      virtualGym: 1
    });
    expect(mutateSpy).toHaveBeenCalledTimes(1);
    expect(mutateSpy).toHaveBeenCalledWith({ gymZones: [response[0]] }, false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onSuccess).toHaveBeenCalledWith('Gym zone created!');
  });

  it('should call on error if ', async () => {
    const mutateSpy = jest.fn().mockImplementation();
    const virtualGymList = { data: { gymZones: [] }, mutate: mutateSpy };

    jest.spyOn(swr, 'default').mockImplementation((key) => {
      if (!key) {
        return emptyResponse as any;
      }
      if (key !== '/virtual-gyms?level=0') {
        return virtualGymList as never;
      }

      return defaultResponse as never;
    });
    poster.mockRejectedValue('Error thrown');

    await act(async () => {
      renderComponent();
    });
    await fillGymZone();

    expect(poster).toHaveBeenCalledTimes(1);
    expect(mutateSpy).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledWith('Error thrown');
  });

  it('should close the dialog', async () => {
    const mutateSpy = jest.fn().mockImplementation();
    jest.spyOn(swr, 'default').mockImplementation((key) => {
      if (key !== '/virtual-gyms?level=0') {
        return { data: { gymZones: [] }, mutate: mutateSpy } as never;
      }

      return { data: [] } as never;
    });

    await act(async () => {
      renderComponent();
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('add-gym-zone'));
    });
    await act(async () => {
      fireEvent.click(screen.getByTitle('close-dialog'));
    });
    await waitForElementToBeRemoved(screen.queryByRole('dialog'));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
