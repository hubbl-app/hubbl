import { ThemeProvider, createTheme } from '@mui/material';
import { render, screen } from '@testing-library/react';
import { FormProvider } from 'react-hook-form';

import Email from './Email';

describe('<Email />', () => {
  const registerSpy = jest.fn();
  const mockFormState = { errors: {} };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render properly', () => {
    const { container } = render(
      <ThemeProvider theme={createTheme()}>
        <FormProvider
          {...({
            register: registerSpy,
            formState: mockFormState
          } as any)}
        >
          <Email />
        </FormProvider>
      </ThemeProvider>
    );

    expect(container).toBeInTheDocument();
  });

  it('should register the field', () => {
    render(
      <ThemeProvider theme={createTheme()}>
        <FormProvider
          {...({
            register: registerSpy,
            formState: mockFormState
          } as any)}
        >
          <Email />
        </FormProvider>
      </ThemeProvider>
    );

    expect(registerSpy).toHaveBeenCalled();
    expect(registerSpy).toHaveBeenCalledWith('email', { required: true });
  });

  describe('disabled', () => {
    it('should disable the field', () => {
      render(
        <ThemeProvider theme={createTheme()}>
          <FormProvider
            {...({
              register: registerSpy,
              formState: mockFormState
            } as any)}
          >
            <Email disabled />
          </FormProvider>
        </ThemeProvider>
      );

      expect(screen.getByPlaceholderText('john.doe@domain.com')).toBeDisabled();
    });
  });
});
