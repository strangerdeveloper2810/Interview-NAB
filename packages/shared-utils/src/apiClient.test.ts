/**
 * @jest-environment jsdom
 */

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockResponse = (status: number, body: any) =>
  Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
    statusText: 'OK',
  });

beforeEach(() => {
  mockFetch.mockReset();
  jest.resetModules();
});

describe('apiClient', () => {
  const loadModule = async () => {
    const mod = await import('./apiClient');
    return mod;
  };

  describe('basic requests', () => {
    it('GET success returns parsed JSON', async () => {
      const { apiClient } = await loadModule();
      const data = { id: 1, name: 'Test' };
      mockFetch.mockReturnValueOnce(mockResponse(200, data));

      const result = await apiClient.get('/users');

      expect(result).toEqual(data);
      expect(mockFetch).toHaveBeenCalledWith('/api/users', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
    });

    it('POST sends body as JSON string', async () => {
      const { apiClient } = await loadModule();
      const payload = { username: 'admin', password: '123' };
      mockFetch.mockReturnValueOnce(mockResponse(201, { success: true }));

      await apiClient.post('/users', payload);

      expect(mockFetch).toHaveBeenCalledWith('/api/users', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(payload),
      });
    });

    it('non-200 response throws ApiError with status and message', async () => {
      const { apiClient } = await loadModule();
      mockFetch.mockReturnValueOnce(mockResponse(403, { message: 'Forbidden' }));

      await expect(apiClient.get('/admin')).rejects.toThrow(
        expect.objectContaining({
          status: 403,
          message: 'Forbidden',
          name: 'Api Error',
        }),
      );
    });
  });

  describe('token refresh on 401', () => {
    it('401 triggers refresh then retries original request', async () => {
      const { apiClient } = await loadModule();
      const data = { id: 1 };

      mockFetch
        .mockReturnValueOnce(mockResponse(401, { message: 'Unauthorized' }))
        .mockReturnValueOnce(mockResponse(200, {}))
        .mockReturnValueOnce(mockResponse(200, data));

      const result = await apiClient.get('/accounts');

      expect(result).toEqual(data);
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
    });
  });

  describe('mutex - multiple concurrent 401s', () => {
    it('only calls refresh once for concurrent 401 requests', async () => {
      const { apiClient } = await loadModule();

      mockFetch
        .mockReturnValueOnce(mockResponse(401, { message: 'Unauthorized' }))
        .mockReturnValueOnce(mockResponse(401, { message: 'Unauthorized' }))
        .mockReturnValueOnce(mockResponse(200, {}))
        .mockReturnValueOnce(mockResponse(200, { data: 'a' }))
        .mockReturnValueOnce(mockResponse(200, { data: 'b' }));

      const [r1, r2] = await Promise.all([
        apiClient.get('/accounts'),
        apiClient.get('/transfers'),
      ]);

      expect(r1).toEqual({ data: 'a' });
      expect(r2).toEqual({ data: 'b' });

      const refreshCalls = mockFetch.mock.calls.filter(
        ([url]: [string]) => url === '/api/auth/refresh',
      );
      expect(refreshCalls).toHaveLength(1);
    });
  });

  describe('refresh failure redirects to login', () => {
    it('throws ApiError(401, "Session expired") and attempts redirect', async () => {
      const { apiClient } = await loadModule();

      // Capture console.error to verify jsdom received the navigation attempt
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      mockFetch
        .mockReturnValueOnce(mockResponse(401, { message: 'Unauthorized' }))
        .mockReturnValueOnce(mockResponse(401, { message: 'Bad refresh' }));

      await expect(apiClient.get('/accounts')).rejects.toThrow(
        expect.objectContaining({
          status: 401,
          message: 'Session expired',
        }),
      );

      // jsdom logs "Not implemented: navigation" when location.href is set,
      // which confirms the redirect to /auth/login was attempted
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Not implemented: navigation'),
        }),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('auth endpoints skip refresh', () => {
    it('auth/login 401 throws directly without refresh', async () => {
      const { apiClient } = await loadModule();
      mockFetch.mockReturnValueOnce(
        mockResponse(401, { message: 'Invalid credentials' }),
      );

      await expect(
        apiClient.post('auth/login', { user: 'x', pass: 'y' }),
      ).rejects.toThrow(
        expect.objectContaining({
          status: 401,
          message: 'Invalid credentials',
        }),
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('/auth/register 401 throws directly without refresh', async () => {
      const { apiClient } = await loadModule();
      mockFetch.mockReturnValueOnce(
        mockResponse(401, { message: 'Registration failed' }),
      );

      await expect(
        apiClient.post('/auth/register', { email: 'a@b.com' }),
      ).rejects.toThrow(
        expect.objectContaining({
          status: 401,
          message: 'Registration failed',
        }),
      );

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });
});
