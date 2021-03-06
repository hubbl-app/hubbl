import { logout } from './logout';

describe('logout', () => {
  const mockRes = {
    clearCookie: jest.fn()
  };

  const mockController = {
    ok: jest.fn()
  };

  it('should clear the cookie and return ok', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2022/01/03'));
    await logout({ res: mockRes, controller: mockController } as any);

    expect(mockRes.clearCookie).toHaveBeenCalledTimes(1);
    expect(mockRes.clearCookie).toHaveBeenCalledWith('__hubbl-refresh__', {
      sameSite: 'none',
      secure: true,
      httpOnly: true,
      path: '/',
      expires: new Date('2022/01/02')
    });
    expect(mockController.ok).toHaveBeenCalledTimes(1);
    expect(mockController.ok).toHaveBeenCalledWith(mockRes);
  });
});
